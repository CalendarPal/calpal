package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"

	"github.com/CalendarPal/calpal-api/account/handlers"
	"github.com/CalendarPal/calpal-api/account/repository"
	"github.com/CalendarPal/calpal-api/account/services"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

// Initialize a handler starting from data sources which injects into
// the repository layer, the service layer, and the handler layer
func inject(d *dataSources) (*gin.Engine, error) {
	log.Println("Injecting data sources")

	/*
	 * Repository layer
	 */
	userRepository := repository.NewUserRepository(d.DB)

	/*
	 * Repository layer
	 */
	userService := services.NewUserService(&services.UserServiceConfig{
		UserRepository: userRepository,
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

	tokenService := services.NewTokenService(&services.TokenServiceConfig{
		PrivKey:       privKey,
		PubKey:        pubKey,
		RefreshSecret: refreshSecret,
	})

	// Initialize gin.Engine
	router := gin.Default()

	handlers.NewHandler(&handlers.Config{
		R:            router,
		UserService:  userService,
		TokenService: tokenService,
	})

	return router, nil
}
