package auth

import (
	"crypto/rsa"
	"log"
	"time"

	"github.com/CalendarPal/calpal-api/account/models"
	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
)

// Structure of JWT claims of idToken
type IDTokenCustomClaims struct {
	User *models.User `json:"user"`
	jwt.StandardClaims
}

// Generate an IDToken which is a JWT with Custom Claims
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

// Struct holds the actual signed JWT string along with the ID
type RefreshToken struct {
	SS        string
	ID        string
	ExpiresIn time.Duration
}

// Struct holds the payload of a refresh token
type RefreshTokenCustomClaims struct {
	UID uuid.UUID `json:"uid"`
	jwt.StandardClaims
}

// Creates a refresh token, the refresh token stores only the user's ID
func GenerateRefreshToken(uid uuid.UUID, key string, exp int64) (*RefreshToken, error) {

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

	return &RefreshToken{
		SS:        ss,
		ID:        tokenID.String(),
		ExpiresIn: tokenExp.Sub(currentTime),
	}, nil
}
