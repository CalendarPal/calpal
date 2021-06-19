package mocks

import (
	"context"

	"github.com/CalendarPal/calpal-api/account/models"
	"github.com/stretchr/testify/mock"
)

// Mock type for models.TokenService
type MockTokenService struct {
	mock.Mock
}

// Mock of NewPairFromUser
func (m *MockTokenService) NewPairFromUser(ctx context.Context, u *models.User, prevTokenID string) (*models.TokenPair, error) {

	ret := m.Called(ctx, u, prevTokenID)

	// The first value to return
	var r0 *models.TokenPair
	if ret.Get(0) != nil {
		r0 = ret.Get(0).(*models.TokenPair)
	}

	// The second value to return
	var r1 error
	if ret.Get(1) != nil {
		r1 = ret.Get(1).(error)
	}

	return r0, r1
}

// Mock of ValidateIDToken
func (m *MockTokenService) ValidateIDToken(tokenString string) (*models.User, error) {

	ret := m.Called(tokenString)

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