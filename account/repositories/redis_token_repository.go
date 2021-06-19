package repository

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/CalendarPal/calpal-api/account/models"
	"github.com/CalendarPal/calpal-api/account/utils/apperrors"
	"github.com/go-redis/redis/v8"
)

// Data and Repository implementation of the service layer TokenRepository
type redisTokenRepository struct {
	Redis *redis.Client
}

// Initializing User Repositories
func NewTokenRepository(redisClient *redis.Client) models.TokenRepository {
	return &redisTokenRepository{
		Redis: redisClient,
	}
}

// Stores a refresh token with an expiry time
func (r *redisTokenRepository) SetRefreshToken(ctx context.Context, userID string, tokenID string, expiresIn time.Duration) error {
	key := fmt.Sprintf("%s:%s", userID, tokenID)
	if err := r.Redis.Set(ctx, key, 0, expiresIn).Err(); err != nil {
		log.Printf("Could not SET refresh token to redis for userID/tokenID: %s/%s: %v\n", userID, tokenID, err)
		return apperrors.NewInternal()
	}
	return nil
}

// Used to delete old refresh tokens
func (r *redisTokenRepository) DeleteRefreshToken(ctx context.Context, userID string, tokenID string) error {
	key := fmt.Sprintf("%s:%s", userID, tokenID)
	if err := r.Redis.Del(ctx, key).Err(); err != nil {
		log.Printf("Could not DELETE refresh token to redis for userID/tokenID: %s/%s: %v\n", userID, tokenID, err)
		return apperrors.NewInternal()
	}

	return nil
}
