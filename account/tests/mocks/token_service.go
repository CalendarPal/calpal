package mocks

import (
	"context"

	"github.com/CalendarPal/calpal-api/account/models"
	"github.com/stretchr/testify/mock"
)

// MockTokenService Mock type for models.TokenService
type MockTokenService struct {
	mock.Mock
}

// NewPairFromUser Mock of NewPairFromUser
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

// ValidateIDToken Mock of ValidateIDToken
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

// ValidateRefreshToken Mock of ValidateRefreshToken
func (m *MockTokenService) ValidateRefreshToken(refreshTokenString string) (*models.RefreshToken, error) {
	ret := m.Called(refreshTokenString)

	var r0 *models.RefreshToken
	if ret.Get(0) != nil {
		r0 = ret.Get(0).(*models.RefreshToken)
	}

	var r1 error
	if ret.Get(1) != nil {
		r1 = ret.Get(1).(error)
	}

	return r0, r1
}
