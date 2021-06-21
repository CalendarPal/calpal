package mocks

import (
	"context"
	"github.com/stretchr/testify/mock"
	"mime/multipart"
)

// MockImageRepository Mock type of models.ImageRepository
type MockImageRepository struct {
	mock.Mock
}

// DeleteProfile Mock of models.ImageRepository DeleteProfile
func (m *MockImageRepository) DeleteProfile(ctx context.Context, objName string) error {
	ret := m.Called(ctx, objName)

	var r0 error
	if ret.Get(0) != nil {
		r0 = ret.Get(0).(error)
	}

	return r0
}

// UpdateProfile Mock of  models.ImageRepository UpdateProfile
func (m *MockImageRepository) UpdateProfile(ctx context.Context, objName string, imageFile multipart.File) (string, error) {
	ret := m.Called(ctx, objName, imageFile)

	// The first value to return
	var r0 string
	if ret.Get(0) != nil {
		r0 = ret.Get(0).(string)
	}

	// The second value to return
	var r1 error
	if ret.Get(1) != nil {
		r1 = ret.Get(1).(error)
	}

	return r0, r1
}
