package services

import (
	"context"
	"crypto/rsa"
	"github.com/google/uuid"
	"log"

	"github.com/CalendarPal/calpal/account/auth"
	"github.com/CalendarPal/calpal/account/models"
	"github.com/CalendarPal/calpal/account/utils/apperrors"
)

// TokenService Struct used for injecting an implementation of TokenRepository for
// use in service methods along with keys and secrets for signing JWT's
type TokenService struct {
	TokenRepository       models.TokenRepository
	PrivKey               *rsa.PrivateKey
	PubKey                *rsa.PublicKey
	RefreshSecret         string
	IDExpirationSecs      int64
	RefreshExpirationSecs int64
}

// TokenServiceConfig holds repositories that will be injected into the service layer
type TokenServiceConfig struct {
	TokenRepository       models.TokenRepository
	PrivKey               *rsa.PrivateKey
	PubKey                *rsa.PublicKey
	RefreshSecret         string
	IDExpirationSecs      int64
	RefreshExpirationSecs int64
}

// NewTokenService Initializes a UserService with its repositories layer dependencies
func NewTokenService(c *TokenServiceConfig) models.TokenService {
	return &TokenService{
		TokenRepository:       c.TokenRepository,
		PrivKey:               c.PrivKey,
		PubKey:                c.PubKey,
		RefreshSecret:         c.RefreshSecret,
		IDExpirationSecs:      c.IDExpirationSecs,
		RefreshExpirationSecs: c.RefreshExpirationSecs,
	}
}

func (s *TokenService) NewPairFromUser(ctx context.Context, u *models.User, prevTokenID string) (*models.TokenPair, error) {
	// Delete user's current refresh token if possible
	if prevTokenID != "" {
		if err := s.TokenRepository.DeleteRefreshToken(ctx, u.UID.String(), prevTokenID); err != nil {
			log.Printf("Could not delete previous refreshToken for uid: %v, tokenID: %v\n", u.UID.String(), prevTokenID)

			return nil, err
		}
	}

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

	// Set freshly minted refresh tokens to the valid token list
	if err := s.TokenRepository.SetRefreshToken(ctx, u.UID.String(), refreshToken.ID.String(), refreshToken.ExpiresIn); err != nil {
		log.Printf("Error storing tokenID for uid: %v. Error: %v\n", u.UID, err.Error())
		return nil, apperrors.NewInternal()
	}

	return &models.TokenPair{
		IDToken:      models.IDToken{SS: idToken},
		RefreshToken: models.RefreshToken{SS: refreshToken.SS, ID: refreshToken.ID, UID: u.UID},
	}, nil
}

// Signout Uses the repository layer to delete all valid tokens for a user
func (s *TokenService) Signout(ctx context.Context, uid uuid.UUID) error {
	return s.TokenRepository.DeleteUserRefreshTokens(ctx, uid.String())
}

// ValidateIDToken Validates the ID token JWT string and returns the user extract from the IDTokenCustomClaims
func (s *TokenService) ValidateIDToken(tokenString string) (*models.User, error) {
	claims, err := auth.ValidateIDToken(tokenString, s.PubKey)

	// Return unauthorized error if user verification fails
	if err != nil {
		log.Printf("Unable to validate or parse idToken - Error: %v\n", err)
		return nil, apperrors.NewAuthorization("Unable to verify user from idToken")
	}

	return claims.User, nil
}

// ValidateRefreshToken Validates the JWT string provided then returns a RefreshToken
func (s *TokenService) ValidateRefreshToken(tokenString string) (*models.RefreshToken, error) {
	// Validate the actual JWT with secret
	claims, err := auth.ValidateRefreshToken(tokenString, s.RefreshSecret)

	// Return unauthorized error if user verification fails
	if err != nil {
		log.Printf("Unable to validate or parse refreshToken for token string: %s\n%v\n", tokenString, err)
		return nil, apperrors.NewAuthorization("Unable to verify user from refreshToken")
	}

	tokenUUID, err := uuid.Parse(claims.Id)

	if err != nil {
		log.Printf("Claims ID could not be parsed as UUID: %s\n%v\n", claims.Id, err)
		return nil, apperrors.NewAuthorization("Unable to verify user from refreshToken")
	}

	return &models.RefreshToken{
		SS:  tokenString,
		ID:  tokenUUID,
		UID: claims.UID,
	}, nil
}
