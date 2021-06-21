package services

import (
	"context"
	"log"

	"github.com/CalendarPal/calpal-api/account/auth"
	"github.com/CalendarPal/calpal-api/account/models"
	"github.com/CalendarPal/calpal-api/account/utils/apperrors"
	"github.com/google/uuid"
)

// UserService Struct for injecting UserRepository for use in service methods
type UserService struct {
	UserRepository models.UserRepository
}

// UserServiceConfig holds repositories that will be injected into the service layer
type UserServiceConfig struct {
	UserRepository models.UserRepository
}

// NewUserService Initializes a UserService with its repositories layer dependencies
func NewUserService(c *UserServiceConfig) models.UserService {
	return &UserService{
		UserRepository: c.UserRepository,
	}
}

// Get Retrieves a user based on their uuid
func (s *UserService) Get(ctx context.Context, uid uuid.UUID) (*models.User, error) {
	u, err := s.UserRepository.FindByID(ctx, uid)

	return u, err
}

// Signup Checks using the UserRepository that the email address is available, then signs up the user
func (s *UserService) Signup(ctx context.Context, u *models.User) error {
	pw, err := auth.HashPassword(u.Password)
	if err != nil {
		log.Printf("Unable to signup user with email: %v\n", u.Email)
		return apperrors.NewInternal()
	}

	u.Password = pw
	return s.UserRepository.Create(ctx, u)
}

// Signin Checks using the UserRepository that the user exists, then compares the supplied password with the provided password
func (s *UserService) Signin(ctx context.Context, u *models.User) error {
	uFetched, err := s.UserRepository.FindByEmail(ctx, u.Email)

	//	Returns NotAuthorized to the client
	if err != nil {
		return apperrors.NewAuthorization("Invalid email and password combination")
	}

	// Verify the password
	match, err := auth.ComparePasswords(uFetched.Password, u.Password)

	if err != nil {
		return apperrors.NewInternal()
	}

	if !match {
		return apperrors.NewAuthorization("Invalid email and password combination")
	}

	*u = *uFetched

	return nil
}

// UpdateDetails Updates the user using the UserRepository
func (s *UserService) UpdateDetails(ctx context.Context, u *models.User) error {
	err := s.UserRepository.Update(ctx, u)

	if err != nil {
		return err
	}

	return nil
}
