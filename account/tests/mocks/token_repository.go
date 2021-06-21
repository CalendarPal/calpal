package mocks

import (
	"context"
	"time"

	"github.com/stretchr/testify/mock"
)

// MockTokenRepository Mock type for models.TokenRepository
type MockTokenRepository struct {
	mock.Mock
}

// SetRefreshToken Mock of models.TokenRepository SetRefreshToken
func (m *MockTokenRepository) SetRefreshToken(ctx context.Context, userID string, tokenID string, expiresIn time.Duration) error {
	ret := m.Called(ctx, userID, tokenID, expiresIn)

	var r0 error

	if ret.Get(0) != nil {
		r0 = ret.Get(0).(error)
	}

	return r0
}

// DeleteRefreshToken Mock of models.TokenRepository DeleteRefreshToken
func (m *MockTokenRepository) DeleteRefreshToken(ctx context.Context, userID string, prevTokenID string) error {
	ret := m.Called(ctx, userID, prevTokenID)

	var r0 error

	if ret.Get(0) != nil {
		r0 = ret.Get(0).(error)
	}

	return r0
}

// DeleteUserRefreshTokens Mock of models.TokenRepository DeleteUserRefreshTokens
func (m *MockTokenRepository) DeleteUserRefreshTokens(ctx context.Context, userID string) error {
	ret := m.Called(ctx, userID)

	var r0 error

	if ret.Get(0) != nil {
		r0 = ret.Get(0).(error)
	}

	return r0
}
