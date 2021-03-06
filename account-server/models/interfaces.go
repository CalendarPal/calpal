package models

import (
	"context"
	"mime/multipart"
	"time"

	"github.com/google/uuid"
)

// UserService defines methods the handler layer expects the service it interacts with to implement
type UserService interface {
	Get(ctx context.Context, uid uuid.UUID) (*User, error)
	Signup(ctx context.Context, u *User) error
	Signin(ctx context.Context, u *User) error
	UpdateDetails(ctx context.Context, u *User) error
	SetProfileImage(ctx context.Context, uid uuid.UUID, imageFileHeader *multipart.FileHeader) (*User, error)
	ClearProfileImage(ctx context.Context, uid uuid.UUID) error
}

// TokenService defines methods the handler later expects to interact with to produce JWT's as string
type TokenService interface {
	NewPairFromUser(ctx context.Context, u *User, prevTokenID string) (*TokenPair, error)
	Signout(ctx context.Context, uid uuid.UUID) error
	ValidateIDToken(tokenString string) (*User, error)
	ValidateRefreshToken(refreshTokenString string) (*RefreshToken, error)
}

// UserRepository defines methods the service layer expects the repositories it interacts with to implement
type UserRepository interface {
	FindByID(ctx context.Context, uid uuid.UUID) (*User, error)
	FindByEmail(ctx context.Context, email string) (*User, error)
	Create(ctx context.Context, u *User) error
	Update(ctx context.Context, u *User) error
	UpdateImage(ctx context.Context, uid uuid.UUID, imageURL string) (*User, error)
}

// TokenRepository defines methods the service layer expects the repositories it interacts with to implement
type TokenRepository interface {
	SetRefreshToken(ctx context.Context, userID string, tokenID string, expiresIn time.Duration) error
	DeleteRefreshToken(ctx context.Context, userID string, prevTokenID string) error
	DeleteUserRefreshTokens(ctx context.Context, userID string) error
}

// ImageRepository defines methods the service layer expects the repositories it interacts with to implement
type ImageRepository interface {
	DeleteProfile(ctx context.Context, objName string) error
	UpdateProfile(ctx context.Context, objName string, imageFile multipart.File) (string, error)
}

type EventsRepository interface {
	PublishUserUpdated(ctx context.Context, u *User, isNewUser bool) error
}
