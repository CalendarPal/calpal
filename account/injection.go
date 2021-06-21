package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/CalendarPal/calpal/account/handlers"
	"github.com/CalendarPal/calpal/account/repositories"
	"github.com/CalendarPal/calpal/account/services"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

// Initialize a handler starting from data sources which injects into
// the repositories layer, the service layer, and the handler layer
func inject(d *dataSources) (*gin.Engine, error) {
	log.Println("Injecting data sources")

	/*
	 * Repository layer
	 */
	userRepository := repositories.NewUserRepository(d.DB)
	tokenRepository := repositories.NewTokenRepository(d.RedisClient)

	bucketName := os.Getenv("GC_IMAGE_BUCKET")
	imageRepository := repositories.NewImageRepository(d.StorageClient, bucketName)

	/*
	 * Service layer
	 */
	userService := services.NewUserService(&services.UserServiceConfig{
		UserRepository:  userRepository,
		ImageRepository: imageRepository,
	})

	// Load rsa keys
	privKeyFile := os.Getenv("PRIV_KEY_FILE")
	priv, err := ioutil.ReadFile(privKeyFile)

	if err != nil {
		return nil, fmt.Errorf("could not read private key pem file: %w", err)
	}

	privKey, err := jwt.ParseRSAPrivateKeyFromPEM(priv)

	if err != nil {
		return nil, fmt.Errorf("could not parse private key: %w", err)
	}

	pubKeyFile := os.Getenv("PUB_KEY_FILE")
	pub, err := ioutil.ReadFile(pubKeyFile)

	if err != nil {
		return nil, fmt.Errorf("could not read public key pem file: %w", err)
	}

	pubKey, err := jwt.ParseRSAPublicKeyFromPEM(pub)

	if err != nil {
		return nil, fmt.Errorf("could not parse public key: %w", err)
	}

	// Load refresh token secret from env variable
	refreshSecret := os.Getenv("REFRESH_SECRET")

	// Load expiration lengths from env variables and parse as int
	idTokenExp := os.Getenv("ID_TOKEN_EXP")
	refreshTokenExp := os.Getenv("REFRESH_TOKEN_EXP")

	idExp, err := strconv.ParseInt(idTokenExp, 0, 64)
	if err != nil {
		return nil, fmt.Errorf("could not parse ID_TOKEN_EXP as int: %w", err)
	}

	refreshExp, err := strconv.ParseInt(refreshTokenExp, 0, 64)
	if err != nil {
		return nil, fmt.Errorf("could not parse REFRESH_TOKEN_EXP as int: %w", err)
	}

	tokenService := services.NewTokenService(&services.TokenServiceConfig{
		TokenRepository:       tokenRepository,
		PrivKey:               privKey,
		PubKey:                pubKey,
		RefreshSecret:         refreshSecret,
		IDExpirationSecs:      idExp,
		RefreshExpirationSecs: refreshExp,
	})

	// Initialize gin.Engine
	router := gin.Default()

	// Read in ACCOUNT_API_URL
	baseURL := os.Getenv("ACCOUNT_API_URL")

	// Read in HANDLER_TIMEOUT
	handlerTimeout := os.Getenv("HANDLER_TIMEOUT")
	ht, err := strconv.ParseInt(handlerTimeout, 0, 64)
	if err != nil {
		return nil, fmt.Errorf("could not parse HANDLER_TIMEOUT as int: %w", err)
	}

	// Read in MAX_BODY_BYTES
	maxBodyBytes := os.Getenv("MAX_BODY_BYTES")
	mbb, err := strconv.ParseInt(maxBodyBytes, 0, 64)
	if err != nil {
		return nil, fmt.Errorf("could not parse MAX_BODY_BYTES as int: %w", err)
	}

	handlers.NewHandler(&handlers.Config{
		R:               router,
		UserService:     userService,
		TokenService:    tokenService,
		BaseURL:         baseURL,
		TimeoutDuration: time.Duration(ht) * time.Second,
		MaxBodyBytes:    mbb,
	})

	return router, nil
}
