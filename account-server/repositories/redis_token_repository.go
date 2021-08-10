package repositories

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/CalendarPal/calpal/account-server/models"
	"github.com/CalendarPal/calpal/account-server/utils/apperrors"
	"github.com/go-redis/redis/v8"
)

// Data and Repository implementation of the service layer TokenRepository
type redisTokenRepository struct {
	Redis *redis.Client
}

// NewTokenRepository Initializing User Repositories
func NewTokenRepository(redisClient *redis.Client) models.TokenRepository {
	return &redisTokenRepository{
		Redis: redisClient,
	}
}

// SetRefreshToken Stores a refresh token with an expiry time
func (r *redisTokenRepository) SetRefreshToken(ctx context.Context, userID string, tokenID string, expiresIn time.Duration) error {
	key := fmt.Sprintf("%s:%s", userID, tokenID)
	if err := r.Redis.Set(ctx, key, 0, expiresIn).Err(); err != nil {
		log.Printf("Could not SET refresh token to redis for userID/tokenID: %s/%s: %v\n", userID, tokenID, err)
		return apperrors.NewInternal()
	}
	return nil
}

// DeleteRefreshToken Used to delete old refresh tokens
func (r *redisTokenRepository) DeleteRefreshToken(ctx context.Context, userID string, tokenID string) error {
	key := fmt.Sprintf("%s:%s", userID, tokenID)

	fmt.Println(key)

	result := r.Redis.Del(ctx, key)

	if err := result.Err(); err != nil {
		log.Printf("Could not DELETE refresh token to redis for userID/tokenID: %s/%s: %v\n", userID, tokenID, err)
		return apperrors.NewInternal()
	}

	// Val returns a count of deleted keys
	if result.Val() < 1 {
		log.Printf("Refresh token to redis for userID/tokenID: %s/%s does not exist\n", userID, tokenID)
		return apperrors.NewAuthorization("Invalid refresh token")
	}

	return nil
}

// DeleteUserRefreshTokens Finds all tokens beginning with the userID then deletes them (non-blocking)
func (r *redisTokenRepository) DeleteUserRefreshTokens(ctx context.Context, userID string) error {
	pattern := fmt.Sprintf("%s*", userID)

	iter := r.Redis.Scan(ctx, 0, pattern, 5).Iterator()
	failCount := 0

	for iter.Next(ctx) {
		if err := r.Redis.Del(ctx, iter.Val()).Err(); err != nil {
			log.Printf("Failed to delete refresh token: %s\n", iter.Val())
			failCount++
		}
	}

	if err := iter.Err(); err != nil {
		log.Printf("Failed to delete refresh token: %s\n", iter.Val())
	}

	if failCount > 0 {
		return apperrors.NewInternal()
	}

	return nil
}
