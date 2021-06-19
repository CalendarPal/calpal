package handlertests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/CalendarPal/calpal-api/account/handlers"
	"github.com/CalendarPal/calpal-api/account/models"
	"github.com/CalendarPal/calpal-api/account/tests/mocks"
	"github.com/CalendarPal/calpal-api/account/utils/apperrors"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestSignin(t *testing.T) {
	// Setup
	gin.SetMode(gin.TestMode)

	// Mock services, Gin engine/router, Handler layer
	mockUserService := new(mocks.MockUserService)
	mockTokenService := new(mocks.MockTokenService)

	router := gin.Default()

	handlers.NewHandler(&handlers.Config{
		R:            router,
		UserService:  mockUserService,
		TokenService: mockTokenService,
	})

	t.Run("Bad request data", func(t *testing.T) { // Http response recorder
		rr := httptest.NewRecorder()

		// Create a request body with invalid fields
		reqBody, err := json.Marshal(gin.H{
			"email":    "notanemail",
			"password": "short",
		})
		assert.NoError(t, err)

		request, err := http.NewRequest(http.MethodPost, "/signin", bytes.NewBuffer(reqBody))
		assert.NoError(t, err)

		request.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(rr, request)

		assert.Equal(t, http.StatusBadRequest, rr.Code)
		mockUserService.AssertNotCalled(t, "Signin")
		mockTokenService.AssertNotCalled(t, "NewTokensFromUser")
	})

	t.Run("Error Returned from UserService.Signin", func(t *testing.T) {
		email := "bob@bob.com"
		password := "pwdoesnotmatch123"

		mockUSArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			&models.User{Email: email, Password: password},
		}

		mockError := apperrors.NewAuthorization("invalid email/password combo")

		mockUserService.On("Signin", mockUSArgs...).Return(mockError)

		// Http response recorder
		rr := httptest.NewRecorder()

		// Create a request body with valid fields
		reqBody, err := json.Marshal(gin.H{
			"email":    email,
			"password": password,
		})
		assert.NoError(t, err)

		request, err := http.NewRequest(http.MethodPost, "/signin", bytes.NewBuffer(reqBody))
		assert.NoError(t, err)

		request.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(rr, request)

		mockUserService.AssertCalled(t, "Signin", mockUSArgs...)
		mockTokenService.AssertNotCalled(t, "NewTokensFromUser")
		assert.Equal(t, http.StatusUnauthorized, rr.Code)
	})

	t.Run("Successful Token Creation", func(t *testing.T) {
		email := "bob@bob.com"
		password := "pwworksgreat123"

		mockUSArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			&models.User{Email: email, Password: password},
		}

		mockUserService.On("Signin", mockUSArgs...).Return(nil)

		mockTSArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			&models.User{Email: email, Password: password},
			"",
		}

		mockTokenPair := &models.TokenPair{
			IDToken:      models.IDToken{SS: "idToken"},
			RefreshToken: models.RefreshToken{SS: "refreshToken"},
		}

		mockTokenService.On("NewPairFromUser", mockTSArgs...).Return(mockTokenPair, nil)

		// Http response recorder
		rr := httptest.NewRecorder()

		// Create a request body with valid fields
		reqBody, err := json.Marshal(gin.H{
			"email":    email,
			"password": password,
		})
		assert.NoError(t, err)

		request, err := http.NewRequest(http.MethodPost, "/signin", bytes.NewBuffer(reqBody))
		assert.NoError(t, err)

		request.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(rr, request)

		respBody, err := json.Marshal(gin.H{
			"tokens": mockTokenPair,
		})
		assert.NoError(t, err)

		assert.Equal(t, http.StatusOK, rr.Code)
		assert.Equal(t, respBody, rr.Body.Bytes())

		mockUserService.AssertCalled(t, "Signin", mockUSArgs...)
		mockTokenService.AssertCalled(t, "NewPairFromUser", mockTSArgs...)
	})

	t.Run("Failed Token Creation", func(t *testing.T) {
		email := "cannotproducetoken@bob.com"
		password := "cannotproducetoken"

		mockUSArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			&models.User{Email: email, Password: password},
		}

		mockUserService.On("Signin", mockUSArgs...).Return(nil)

		mockTSArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			&models.User{Email: email, Password: password},
			"",
		}

		mockError := apperrors.NewInternal()
		mockTokenService.On("NewPairFromUser", mockTSArgs...).Return(nil, mockError)

		// Http response recorder
		rr := httptest.NewRecorder()

		// Create a request body with valid fields
		reqBody, err := json.Marshal(gin.H{
			"email":    email,
			"password": password,
		})
		assert.NoError(t, err)

		request, err := http.NewRequest(http.MethodPost, "/signin", bytes.NewBuffer(reqBody))
		assert.NoError(t, err)

		request.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(rr, request)

		respBody, err := json.Marshal(gin.H{
			"error": mockError,
		})
		assert.NoError(t, err)

		assert.Equal(t, mockError.Status(), rr.Code)
		assert.Equal(t, respBody, rr.Body.Bytes())

		mockUserService.AssertCalled(t, "Signin", mockUSArgs...)
		mockTokenService.AssertCalled(t, "NewPairFromUser", mockTSArgs...)
	})
}
