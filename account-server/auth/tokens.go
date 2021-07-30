package auth

import (
	"crypto/rsa"
	"fmt"
	"log"
	"time"

	"github.com/CalendarPal/calpal/account-server/models"
	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
)

// IDTokenCustomClaims Structure of JWT claims of idToken
type IDTokenCustomClaims struct {
	User *models.User `json:"user"`
	jwt.StandardClaims
}

// GenerateIDToken Generate an IDToken which is a JWT with Custom Claims
func GenerateIDToken(u *models.User, key *rsa.PrivateKey, exp int64) (string, error) {
	unixTime := time.Now().Unix()
	tokenExp := unixTime + exp

	claims := IDTokenCustomClaims{
		User: u,
		StandardClaims: jwt.StandardClaims{
			IssuedAt:  unixTime,
			ExpiresAt: tokenExp,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	ss, err := token.SignedString(key)

	if err != nil {
		log.Println("Failed to sign id token string")
		return "", err
	}

	return ss, nil
}

// RefreshTokenData Struct holds the actual signed JWT string along with the ID
type RefreshTokenData struct {
	SS        string
	ID        uuid.UUID
	ExpiresIn time.Duration
}

// RefreshTokenCustomClaims Struct holds the payload of a refresh token
type RefreshTokenCustomClaims struct {
	UID uuid.UUID `json:"uid"`
	jwt.StandardClaims
}

// GenerateRefreshToken Creates a refresh token, the refresh token stores only the user's ID
func GenerateRefreshToken(uid uuid.UUID, key string, exp int64) (*RefreshTokenData, error) {
	currentTime := time.Now()
	tokenExp := currentTime.Add(time.Duration(exp) * time.Second)
	tokenID, err := uuid.NewRandom()

	if err != nil {
		log.Println("Failed to generate refresh token ID")
		return nil, err
	}

	claims := RefreshTokenCustomClaims{
		UID: uid,
		StandardClaims: jwt.StandardClaims{
			IssuedAt:  currentTime.Unix(),
			ExpiresAt: tokenExp.Unix(),
			Id:        tokenID.String(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ss, err := token.SignedString([]byte(key))

	if err != nil {
		log.Println("Failed to sign refresh token string")
		return nil, err
	}

	return &RefreshTokenData{
		SS:        ss,
		ID:        tokenID,
		ExpiresIn: tokenExp.Sub(currentTime),
	}, nil
}

// ValidateIDToken Returns the token's claims if the token in valid
func ValidateIDToken(tokenString string, key *rsa.PublicKey) (*IDTokenCustomClaims, error) {
	claims := &IDTokenCustomClaims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return key, nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, fmt.Errorf("ID token is invalid")
	}

	claims, ok := token.Claims.(*IDTokenCustomClaims)

	if !ok {
		return nil, fmt.Errorf("ID token is valid but failed to parse claims")
	}

	return claims, nil
}

// ValidateRefreshToken Uses the secret key to validate a refresh token
func ValidateRefreshToken(tokenString string, key string) (*RefreshTokenCustomClaims, error) {
	claims := &RefreshTokenCustomClaims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(key), nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, fmt.Errorf("refresh token is invalid")
	}

	claims, ok := token.Claims.(*RefreshTokenCustomClaims)

	if !ok {
		return nil, fmt.Errorf("refresh token is valid but failed to parse claims")
	}

	return claims, nil
}
