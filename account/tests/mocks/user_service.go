package mocks

import (
	"context"
	"mime/multipart"

	"github.com/CalendarPal/calpal/account/models"
	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

// MockUserService Mock type for models.UserService
type MockUserService struct {
	mock.Mock
}

// Get Mock of models.UserService Get
func (m *MockUserService) Get(ctx context.Context, uid uuid.UUID) (*models.User, error) { // Args that will get returned in the tests when a function is called with a uid
	ret := m.Called(ctx, uid)

	// The first value to return
	var r0 *models.User
	if ret.Get(0) != nil {
		r0 = ret.Get(0).(*models.User)
	}

	// The second value to return
	var r1 error
	if ret.Get(1) != nil {
		r1 = ret.Get(1).(error)
	}

	return r0, r1
}

// Signup Mock of models.UserService Signup
func (m *MockUserService) Signup(ctx context.Context, u *models.User) error {
	ret := m.Called(ctx, u)

	var r0 error
	if ret.Get(0) != nil {
		r0 = ret.Get(0).(error)
	}

	return r0
}

// Signin Mock of models.UserService Signin
func (m *MockUserService) Signin(ctx context.Context, u *models.User) error {
	ret := m.Called(ctx, u)

	var r0 error
	if ret.Get(0) != nil {
		r0 = ret.Get(0).(error)
	}

	return r0
}

// UpdateDetails Mock of models.UserService UpdateDetails
func (m *MockUserService) UpdateDetails(ctx context.Context, u *models.User) error {
	ret := m.Called(ctx, u)

	var r0 error
	if ret.Get(0) != nil {
		r0 = ret.Get(0).(error)
	}

	return r0
}

// SetProfileImage Mock of models.UserService SetProfileImage
func (m *MockUserService) SetProfileImage(ctx context.Context, uid uuid.UUID, imageFileHeader *multipart.FileHeader) (*models.User, error) {
	ret := m.Called(ctx, uid, imageFileHeader)

	var r0 *models.User
	if ret.Get(0) != nil {
		r0 = ret.Get(0).(*models.User)
	}

	var r1 error
	if ret.Get(1) != nil {
		r1 = ret.Get(1).(error)
	}

	return r0, r1
}

// ClearProfileImage Mock of models.UserService ClearProfileImage
func (m *MockUserService) ClearProfileImage(ctx context.Context, uid uuid.UUID) error {
	ret := m.Called(ctx, uid)

	var r0 error
	if ret.Get(0) != nil {
		r0 = ret.Get(0).(error)
	}

	return r0
}
