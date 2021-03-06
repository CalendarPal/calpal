package mocks

import (
	"context"

	"github.com/CalendarPal/calpal/account-server/models"
	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

// MockUserRepository Mock type for models.UserRepository
type MockUserRepository struct {
	mock.Mock
}

// FindByID Mock of models.UserRepository FindByID
func (m *MockUserRepository) FindByID(ctx context.Context, uid uuid.UUID) (*models.User, error) { // Args that will get returned in the tests when a function is called with a uid
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

// Create Mock of models.UserRepository Create
func (m *MockUserRepository) Create(ctx context.Context, u *models.User) error {
	ret := m.Called(ctx, u)

	var r0 error
	if ret.Get(0) != nil {
		r0 = ret.Get(0).(error)
	}

	return r0
}

// FindByEmail Mock of models.UserRepository FindByEmail
func (m *MockUserRepository) FindByEmail(ctx context.Context, email string) (*models.User, error) {
	ret := m.Called(ctx, email)

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

// Update Mock of models.UserRepository Update
func (m *MockUserRepository) Update(ctx context.Context, u *models.User) error {
	ret := m.Called(ctx, u)

	var r0 error
	if ret.Get(0) != nil {
		r0 = ret.Get(0).(error)
	}

	return r0
}

// UpdateImage Mock of models.UserRepository UpdateImage
func (m *MockUserRepository) UpdateImage(ctx context.Context, uid uuid.UUID, imageURL string) (*models.User, error) {
	ret := m.Called(ctx, uid, imageURL)

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
