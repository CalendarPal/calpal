package servicetests

import (
	"context"
	"fmt"
	"testing"

	"github.com/CalendarPal/calpal/account-server/auth"
	"github.com/CalendarPal/calpal/account-server/models"
	"github.com/CalendarPal/calpal/account-server/services"
	"github.com/CalendarPal/calpal/account-server/tests/fixtures"
	"github.com/CalendarPal/calpal/account-server/tests/mocks"
	"github.com/CalendarPal/calpal/account-server/utils/apperrors"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

const testImageURL = "http://imageurl.com/jdfkj34kljl"

func TestGet(t *testing.T) {
	t.Run("Success", func(t *testing.T) {
		uid, _ := uuid.NewRandom()

		mockUserResp := &models.User{
			UID:   uid,
			Email: "bob@bob.com",
			Name:  "Bobby Bobson",
		}

		mockUserRepository := new(mocks.MockUserRepository)
		us := services.NewUserService(&services.UserServiceConfig{
			UserRepository: mockUserRepository,
		})
		mockUserRepository.On("FindByID", mock.Anything, uid).Return(mockUserResp, nil)

		ctx := context.TODO()
		u, err := us.Get(ctx, uid)

		assert.NoError(t, err)
		assert.Equal(t, u, mockUserResp)
		mockUserRepository.AssertExpectations(t)
	})

	t.Run("Error", func(t *testing.T) {
		uid, _ := uuid.NewRandom()

		mockUserRepository := new(mocks.MockUserRepository)
		us := services.NewUserService(&services.UserServiceConfig{
			UserRepository: mockUserRepository,
		})

		mockUserRepository.On("FindByID", mock.Anything, uid).Return(nil, fmt.Errorf("some error down the call chain"))

		ctx := context.TODO()
		u, err := us.Get(ctx, uid)

		assert.Nil(t, u)
		assert.Error(t, err)
		mockUserRepository.AssertExpectations(t)
	})
}

func TestSignup(t *testing.T) {
	t.Run("Success", func(t *testing.T) {
		uid, _ := uuid.NewRandom()

		mockUser := &models.User{
			Email:    "bob@bob.com",
			Password: "howdyhoneighbor!",
		}

		mockUserRepository := new(mocks.MockUserRepository)
		us := services.NewUserService(&services.UserServiceConfig{
			UserRepository: mockUserRepository,
		})

		mockUserRepository.
			On("Create", mock.AnythingOfType("*context.emptyCtx"), mockUser).
			Run(func(args mock.Arguments) {
				userArg := args.Get(1).(*models.User) // arg 0 is context, arg 1 is *User
				userArg.UID = uid
			}).Return(nil)

		ctx := context.TODO()
		err := us.Signup(ctx, mockUser)

		assert.NoError(t, err)

		assert.Equal(t, uid, mockUser.UID)

		mockUserRepository.AssertExpectations(t)
	})

	t.Run("Error", func(t *testing.T) {
		mockUser := &models.User{
			Email:    "bob@bob.com",
			Password: "howdyhoneighbor!",
		}

		mockUserRepository := new(mocks.MockUserRepository)
		us := services.NewUserService(&services.UserServiceConfig{
			UserRepository: mockUserRepository,
		})

		mockErr := apperrors.NewConflict("email", mockUser.Email)

		mockUserRepository.
			On("Create", mock.AnythingOfType("*context.emptyCtx"), mockUser).
			Return(mockErr)

		ctx := context.TODO()
		err := us.Signup(ctx, mockUser)

		assert.EqualError(t, err, mockErr.Error())

		mockUserRepository.AssertExpectations(t)
	})
}

func TestSignin(t *testing.T) {
	email := "bob@bob.com"
	validPW := "howdyhoneighbor!"
	hashedValidPW, _ := auth.HashPassword(validPW)
	invalidPW := "howdyhodufus!"

	mockUserRepository := new(mocks.MockUserRepository)
	us := services.NewUserService(&services.UserServiceConfig{
		UserRepository: mockUserRepository,
	})

	t.Run("Success", func(t *testing.T) {
		uid, _ := uuid.NewRandom()

		mockUser := &models.User{
			Email:    email,
			Password: validPW,
		}

		mockUserResp := &models.User{
			UID:      uid,
			Email:    email,
			Password: hashedValidPW,
		}

		mockArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			email,
		}

		mockUserRepository.
			On("FindByEmail", mockArgs...).Return(mockUserResp, nil)

		ctx := context.TODO()
		err := us.Signin(ctx, mockUser)

		assert.NoError(t, err)
		mockUserRepository.AssertCalled(t, "FindByEmail", mockArgs...)
	})

	t.Run("Invalid email/password combination", func(t *testing.T) {
		uid, _ := uuid.NewRandom()

		mockUser := &models.User{
			Email:    email,
			Password: invalidPW,
		}

		mockUserResp := &models.User{
			UID:      uid,
			Email:    email,
			Password: hashedValidPW,
		}

		mockArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			email,
		}

		mockUserRepository.
			On("FindByEmail", mockArgs...).Return(mockUserResp, nil)

		ctx := context.TODO()
		err := us.Signin(ctx, mockUser)

		assert.Error(t, err)
		assert.EqualError(t, err, "Invalid email and password combination")
		mockUserRepository.AssertCalled(t, "FindByEmail", mockArgs...)
	})
}

func TestUpdateDetails(t *testing.T) {
	mockUserRepository := new(mocks.MockUserRepository)
	us := services.NewUserService(&services.UserServiceConfig{
		UserRepository: mockUserRepository,
	})

	t.Run("Success", func(t *testing.T) {
		uid, _ := uuid.NewRandom()

		mockUser := &models.User{
			UID:     uid,
			Email:   "new@bob.com",
			Website: "https://jacobgoodwin.me",
			Name:    "A New Bob!",
		}

		mockArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			mockUser,
		}

		mockUserRepository.
			On("Update", mockArgs...).Return(nil)

		ctx := context.TODO()
		err := us.UpdateDetails(ctx, mockUser)

		assert.NoError(t, err)
		mockUserRepository.AssertCalled(t, "Update", mockArgs...)
	})

	t.Run("Failure", func(t *testing.T) {
		uid, _ := uuid.NewRandom()

		mockUser := &models.User{
			UID: uid,
		}

		mockArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			mockUser,
		}

		mockError := apperrors.NewInternal()

		mockUserRepository.
			On("Update", mockArgs...).Return(mockError)

		ctx := context.TODO()
		err := us.UpdateDetails(ctx, mockUser)
		assert.Error(t, err)

		apperror, ok := err.(*apperrors.Error)
		assert.True(t, ok)
		assert.Equal(t, apperrors.Internal, apperror.Type)

		mockUserRepository.AssertCalled(t, "Update", mockArgs...)
	})
}

func TestSetProfileImage(t *testing.T) {
	mockUserRepository := new(mocks.MockUserRepository)
	mockImageRepository := new(mocks.MockImageRepository)

	us := services.NewUserService(&services.UserServiceConfig{
		UserRepository:  mockUserRepository,
		ImageRepository: mockImageRepository,
	})

	t.Run("Successful new image", func(t *testing.T) {
		uid, _ := uuid.NewRandom()

		// does not have have imageURL
		mockUser := &models.User{
			UID:     uid,
			Email:   "new@bob.com",
			Website: "https://jacobgoodwin.me",
			Name:    "A New Bob!",
		}

		findByIDArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			uid,
		}
		mockUserRepository.On("FindByID", findByIDArgs...).Return(mockUser, nil)

		multipartImageFixture := fixtures.NewMultipartImage("image.png", "image/png")
		defer multipartImageFixture.Close()
		imageFileHeader := multipartImageFixture.GetFormFile()
		imageFile, _ := imageFileHeader.Open()

		updateProfileArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			mock.AnythingOfType("string"),
			imageFile,
		}

		imageURL := testImageURL

		mockImageRepository.
			On("UpdateProfile", updateProfileArgs...).
			Return(imageURL, nil)

		updateImageArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			mockUser.UID,
			imageURL,
		}

		mockUpdatedUser := &models.User{
			UID:      uid,
			Email:    "new@bob.com",
			Website:  "https://jacobgoodwin.me",
			Name:     "A New Bob!",
			ImageURL: imageURL,
		}

		mockUserRepository.
			On("UpdateImage", updateImageArgs...).
			Return(mockUpdatedUser, nil)

		ctx := context.TODO()

		updatedUser, err := us.SetProfileImage(ctx, mockUser.UID, imageFileHeader)

		assert.NoError(t, err)
		assert.Equal(t, mockUpdatedUser, updatedUser)
		mockUserRepository.AssertCalled(t, "FindByID", findByIDArgs...)
		mockImageRepository.AssertCalled(t, "UpdateProfile", updateProfileArgs...)
		mockUserRepository.AssertCalled(t, "UpdateImage", updateImageArgs...)
	})

	t.Run("Successful update image", func(t *testing.T) {
		uid, _ := uuid.NewRandom()
		imageURL := testImageURL

		// has imageURL
		mockUser := &models.User{
			UID:      uid,
			Email:    "new@bob.com",
			Website:  "https://jacobgoodwin.me",
			Name:     "A New Bob!",
			ImageURL: imageURL,
		}

		findByIDArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			uid,
		}
		mockUserRepository.On("FindByID", findByIDArgs...).Return(mockUser, nil)

		multipartImageFixture := fixtures.NewMultipartImage("image.png", "image/png")
		defer multipartImageFixture.Close()
		imageFileHeader := multipartImageFixture.GetFormFile()
		imageFile, _ := imageFileHeader.Open()

		updateProfileArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			mock.AnythingOfType("string"),
			imageFile,
		}

		mockImageRepository.
			On("UpdateProfile", updateProfileArgs...).
			Return(imageURL, nil)

		updateImageArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			mockUser.UID,
			imageURL,
		}

		mockUpdatedUser := &models.User{
			UID:      uid,
			Email:    "new@bob.com",
			Website:  "https://jacobgoodwin.me",
			Name:     "A New Bob!",
			ImageURL: imageURL,
		}

		mockUserRepository.
			On("UpdateImage", updateImageArgs...).
			Return(mockUpdatedUser, nil)

		ctx := context.TODO()

		updatedUser, err := us.SetProfileImage(ctx, uid, imageFileHeader)

		assert.NoError(t, err)
		assert.Equal(t, mockUpdatedUser, updatedUser)
		mockUserRepository.AssertCalled(t, "FindByID", findByIDArgs...)
		mockImageRepository.AssertCalled(t, "UpdateProfile", updateProfileArgs...)
		mockUserRepository.AssertCalled(t, "UpdateImage", updateImageArgs...)
	})

	t.Run("UserRepository FindByID Error", func(t *testing.T) {
		uid, _ := uuid.NewRandom()

		findByIDArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			uid,
		}
		mockError := apperrors.NewInternal()
		mockUserRepository.On("FindByID", findByIDArgs...).Return(nil, mockError)

		multipartImageFixture := fixtures.NewMultipartImage("image.png", "image/png")
		defer multipartImageFixture.Close()
		imageFileHeader := multipartImageFixture.GetFormFile()

		ctx := context.TODO()

		updatedUser, err := us.SetProfileImage(ctx, uid, imageFileHeader)

		assert.Error(t, err)
		assert.Nil(t, updatedUser)
		mockUserRepository.AssertCalled(t, "FindByID", findByIDArgs...)
		mockImageRepository.AssertNotCalled(t, "UpdateProfile")
		mockUserRepository.AssertNotCalled(t, "UpdateImage")
	})

	t.Run("ImageRepository Error", func(t *testing.T) {
		mockUserRepository := new(mocks.MockUserRepository)
		mockImageRepository := new(mocks.MockImageRepository)

		us := services.NewUserService(&services.UserServiceConfig{
			UserRepository:  mockUserRepository,
			ImageRepository: mockImageRepository,
		})

		uid, _ := uuid.NewRandom()
		imageURL := testImageURL

		// has imageURL
		mockUser := &models.User{
			UID:      uid,
			Email:    "new@bob.com",
			Website:  "https://jacobgoodwin.me",
			Name:     "A New Bob!",
			ImageURL: imageURL,
		}

		findByIDArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			uid,
		}
		mockUserRepository.On("FindByID", findByIDArgs...).Return(mockUser, nil)

		multipartImageFixture := fixtures.NewMultipartImage("image.png", "image/png")
		defer multipartImageFixture.Close()
		imageFileHeader := multipartImageFixture.GetFormFile()
		imageFile, _ := imageFileHeader.Open()

		updateProfileArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			mock.AnythingOfType("string"),
			imageFile,
		}

		mockError := apperrors.NewInternal()
		mockImageRepository.
			On("UpdateProfile", updateProfileArgs...).
			Return(nil, mockError)

		ctx := context.TODO()
		updatedUser, err := us.SetProfileImage(ctx, uid, imageFileHeader)

		assert.Nil(t, updatedUser)
		assert.Error(t, err)
		mockUserRepository.AssertCalled(t, "FindByID", findByIDArgs...)
		mockImageRepository.AssertCalled(t, "UpdateProfile", updateProfileArgs...)
		mockUserRepository.AssertNotCalled(t, "UpdateImage")
	})

	t.Run("UserRepository UpdateImage Error", func(t *testing.T) {
		uid, _ := uuid.NewRandom()
		imageURL := testImageURL

		// has imageURL
		mockUser := &models.User{
			UID:      uid,
			Email:    "new@bob.com",
			Website:  "https://jacobgoodwin.me",
			Name:     "A New Bob!",
			ImageURL: imageURL,
		}

		findByIDArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			uid,
		}
		mockUserRepository.On("FindByID", findByIDArgs...).Return(mockUser, nil)

		multipartImageFixture := fixtures.NewMultipartImage("image.png", "image/png")
		defer multipartImageFixture.Close()
		imageFileHeader := multipartImageFixture.GetFormFile()
		imageFile, _ := imageFileHeader.Open()

		updateProfileArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			mock.AnythingOfType("string"),
			imageFile,
		}

		mockImageRepository.
			On("UpdateProfile", updateProfileArgs...).
			Return(imageURL, nil)

		updateImageArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			mockUser.UID,
			imageURL,
		}

		mockError := apperrors.NewInternal()
		mockUserRepository.
			On("UpdateImage", updateImageArgs...).
			Return(nil, mockError)

		ctx := context.TODO()

		updatedUser, err := us.SetProfileImage(ctx, uid, imageFileHeader)

		assert.Error(t, err)
		assert.Nil(t, updatedUser)
		mockImageRepository.AssertCalled(t, "UpdateProfile", updateProfileArgs...)
		mockUserRepository.AssertCalled(t, "UpdateImage", updateImageArgs...)
	})
}
