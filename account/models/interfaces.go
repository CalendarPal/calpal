package models

import (
	"context"

	"github.com/google/uuid"
)

// UserService defines methods the handler layer expects the service it interacts with to implement
type UserService interface {
	Get(ctx context.Context, uid uuid.UUID) (*User, error)
	Signup(ctx context.Context, u *User) error
}

// TokenService defines methods the handler later expects to interact with to produce JWT's as string
type TokenService interface {
	NewPairFromUser(ctx context.Context, u *User, prevTokenID string) (*TokenPair, error)
}

// UserRepository defines methods the service layer expects the repository it interacts with to implement
type UserRepository interface {
	FindByID(ctx context.Context, uid uuid.UUID) (*User, error)
}
