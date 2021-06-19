package mocks

import (
	"context"

	"github.com/CalendarPal/calpal-api/account/models"
	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

// Mock type for models.UserService
type MockUserService struct {
	mock.Mock
}

// Mock of UserService Get
func (m *MockUserService) Get(ctx context.Context, uid uuid.UUID) (*models.User, error) {

	// Args that will get returned in the tests when a function is called with a uid
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

// Mock of UserService Signup
func (m *MockUserService) Signup(ctx context.Context, u *models.User) error {

	ret := m.Called(ctx, u)

	var r0 error
	if ret.Get(0) != nil {
		r0 = ret.Get(0).(error)
	}

	return r0
}

// Mock of UserService Signin
func (m *MockUserService) Signin(ctx context.Context, u *models.User) error {

	ret := m.Called(ctx, u)

	var r0 error
	if ret.Get(0) != nil {
		r0 = ret.Get(0).(error)
	}

	return r0
}
