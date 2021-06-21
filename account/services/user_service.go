package services

import (
	"context"
	"log"
	"mime/multipart"
	"net/url"
	"path"

	"github.com/CalendarPal/calpal/account/auth"
	"github.com/CalendarPal/calpal/account/models"
	"github.com/CalendarPal/calpal/account/utils/apperrors"
	"github.com/google/uuid"
)

// UserService Struct for injecting UserRepository for use in service methods
type UserService struct {
	UserRepository  models.UserRepository
	ImageRepository models.ImageRepository
}

// UserServiceConfig holds repositories that will be injected into the service layer
type UserServiceConfig struct {
	UserRepository  models.UserRepository
	ImageRepository models.ImageRepository
}

// NewUserService Initializes a UserService with its repositories layer dependencies
func NewUserService(c *UserServiceConfig) models.UserService {
	return &UserService{
		UserRepository:  c.UserRepository,
		ImageRepository: c.ImageRepository,
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

// SetProfileImage Sets the user's profile image using the UserRepository
func (s *UserService) SetProfileImage(ctx context.Context, uid uuid.UUID, imageFileHeader *multipart.FileHeader) (*models.User, error) {
	u, err := s.UserRepository.FindByID(ctx, uid)

	if err != nil {
		return nil, err
	}

	objName, err := objNameFromURL(u.ImageURL)

	if err != nil {
		return nil, err
	}

	imageFile, err := imageFileHeader.Open()
	if err != nil {
		log.Printf("Failed to open image file: %v\n", err)
		return nil, apperrors.NewInternal()
	}

	// Upload user's image to ImageRepository
	imageURL, err := s.ImageRepository.UpdateProfile(ctx, objName, imageFile)

	if err != nil {
		log.Printf("Unable to upload image to cloud provider: %v\n", err)
		return nil, err
	}

	updatedUser, err := s.UserRepository.UpdateImage(ctx, u.UID, imageURL)

	if err != nil {
		log.Printf("Unable to update imageURL: %v\n", err)
		return nil, err
	}

	return updatedUser, nil
}

func objNameFromURL(imageURL string) (string, error) {
	// Creates an imageURL if user doesn't have one, otherwise, extract last part of URL to get cloud storage object name
	if imageURL == "" {
		objID, _ := uuid.NewRandom()
		return objID.String(), nil
	}

	// Split off last part of URL (the image's storage object ID)
	urlPath, err := url.Parse(imageURL)

	if err != nil {
		log.Printf("Failed to parse objectName from imageURL: %v\n", imageURL)
		return "", apperrors.NewInternal()
	}

	// Get "path" and "base" of url
	return path.Base(urlPath.Path), nil
}

// ClearProfileImage Deletes the user's profile image using the UserRepository
func (s *UserService) ClearProfileImage(ctx context.Context, uid uuid.UUID) error {
	user, err := s.UserRepository.FindByID(ctx, uid)

	if err != nil {
		return err
	}

	if user.ImageURL == "" {
		return nil
	}

	objName, err := objNameFromURL(user.ImageURL)
	if err != nil {
		return err
	}

	err = s.ImageRepository.DeleteProfile(ctx, objName)
	if err != nil {
		return err
	}

	_, err = s.UserRepository.UpdateImage(ctx, uid, "")

	if err != nil {
		return err
	}

	return nil
}
