package services

import (
	"context"
	"crypto/rsa"
	"log"

	"github.com/CalendarPal/calpal-api/account/auth"
	"github.com/CalendarPal/calpal-api/account/models"
	"github.com/CalendarPal/calpal-api/account/utils/apperrors"
)

// Struct used for injecting an implementation of TokenRepository for
// use in service methods along with keys and secrets for signing JWT's
type TokenService struct {
	PrivKey               *rsa.PrivateKey
	PubKey                *rsa.PublicKey
	RefreshSecret         string
	IDExpirationSecs      int64
	RefreshExpirationSecs int64
}

// TokenServiceConfig holds repositories that will be injected into the service layer
type TokenServiceConfig struct {
	PrivKey               *rsa.PrivateKey
	PubKey                *rsa.PublicKey
	RefreshSecret         string
	IDExpirationSecs      int64
	RefreshExpirationSecs int64
}

// Initializes a UserService with its repository layer dependencies
func NewTokenService(c *TokenServiceConfig) models.TokenService {
	return &TokenService{
		PrivKey:               c.PrivKey,
		PubKey:                c.PubKey,
		RefreshSecret:         c.RefreshSecret,
		IDExpirationSecs:      c.IDExpirationSecs,
		RefreshExpirationSecs: c.RefreshExpirationSecs,
	}
}

func (s *TokenService) NewPairFromUser(ctx context.Context, u *models.User, prevTokenID string) (*models.TokenPair, error) {

	idToken, err := auth.GenerateIDToken(u, s.PrivKey, s.IDExpirationSecs)

	if err != nil {
		log.Printf("Error generating idToken for uid: %v. Error: %v\n", u.UID, err.Error())
		return nil, apperrors.NewInternal()
	}

	refreshToken, err := auth.GenerateRefreshToken(u.UID, s.RefreshSecret, s.RefreshExpirationSecs)

	if err != nil {
		log.Printf("Error generating refreshToken for uid: %v. Error: %v\n", u.UID, err.Error())
		return nil, apperrors.NewInternal()
	}

	// TODO: Store refresh tokens by calling TokenRepository methods

	return &models.TokenPair{
		IDToken:      idToken,
		RefreshToken: refreshToken.SS,
	}, nil
}
