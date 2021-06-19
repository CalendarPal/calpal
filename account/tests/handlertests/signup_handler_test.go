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

func TestSignup(t *testing.T) {
	// Setup
	gin.SetMode(gin.TestMode)

	t.Run("Email and Password Required", func(t *testing.T) {
		mockUserService := new(mocks.MockUserService)
		mockUserService.On("Signup", mock.AnythingOfType("*context.emptyCtx"), mock.AnythingOfType("*models.User")).Return(nil)

		// Http response recorder
		rr := httptest.NewRecorder()

		router := gin.Default()

		handlers.NewHandler(&handlers.Config{
			R:           router,
			UserService: mockUserService,
		})

		// Create a request body
		reqBody, err := json.Marshal(gin.H{
			"email": "",
		})
		assert.NoError(t, err)

		// Create a reader
		request, err := http.NewRequest(http.MethodPost, "/signup", bytes.NewBuffer(reqBody))
		assert.NoError(t, err)

		request.Header.Set("Content-Type", "application/json")

		router.ServeHTTP(rr, request)

		assert.Equal(t, 400, rr.Code)
		mockUserService.AssertNotCalled(t, "Signup")
	})

	t.Run("Invalid email", func(t *testing.T) {

		mockUserService := new(mocks.MockUserService)
		mockUserService.On("Signup", mock.AnythingOfType("*context.emptyCtx"), mock.AnythingOfType("*models.User")).Return(nil)

		// Http response recorder
		rr := httptest.NewRecorder()

		router := gin.Default()

		handlers.NewHandler(&handlers.Config{
			R:           router,
			UserService: mockUserService,
		})

		// Create a request body
		reqBody, err := json.Marshal(gin.H{
			"email":    "bob@bob",
			"password": "supersecret1234",
		})
		assert.NoError(t, err)

		// Create a reader
		request, err := http.NewRequest(http.MethodPost, "/signup", bytes.NewBuffer(reqBody))
		assert.NoError(t, err)

		request.Header.Set("Content-Type", "application/json")

		router.ServeHTTP(rr, request)

		assert.Equal(t, 400, rr.Code)
		mockUserService.AssertNotCalled(t, "Signup")
	})

	t.Run("Password too short", func(t *testing.T) {

		mockUserService := new(mocks.MockUserService)
		mockUserService.On("Signup", mock.AnythingOfType("*context.emptyCtx"), mock.AnythingOfType("*models.User")).Return(nil)

		// Http response recorder
		rr := httptest.NewRecorder()

		router := gin.Default()

		handlers.NewHandler(&handlers.Config{
			R:           router,
			UserService: mockUserService,
		})

		// Create a request body
		reqBody, err := json.Marshal(gin.H{
			"email":    "bob@bob.com",
			"password": "supe",
		})
		assert.NoError(t, err)

		// Create a reader
		request, err := http.NewRequest(http.MethodPost, "/signup", bytes.NewBuffer(reqBody))
		assert.NoError(t, err)

		request.Header.Set("Content-Type", "application/json")

		router.ServeHTTP(rr, request)

		assert.Equal(t, 400, rr.Code)
		mockUserService.AssertNotCalled(t, "Signup")
	})

	t.Run("Password too long", func(t *testing.T) {

		mockUserService := new(mocks.MockUserService)
		mockUserService.On("Signup", mock.AnythingOfType("*context.emptyCtx"), mock.AnythingOfType("*models.User")).Return(nil)

		// Http response recorder
		rr := httptest.NewRecorder()

		router := gin.Default()

		handlers.NewHandler(&handlers.Config{
			R:           router,
			UserService: mockUserService,
		})

		// Create a request body
		reqBody, err := json.Marshal(gin.H{
			"email":    "bob@bob.com",
			"password": "super12324jhklafsdjhflkjweyruasdljkfhasdldfjkhasdkljhrleqwwjkrhlqwejrhasdflkjhasdf",
		})
		assert.NoError(t, err)

		// Create a reader
		request, err := http.NewRequest(http.MethodPost, "/signup", bytes.NewBuffer(reqBody))
		assert.NoError(t, err)

		request.Header.Set("Content-Type", "application/json")

		router.ServeHTTP(rr, request)

		assert.Equal(t, 400, rr.Code)
		mockUserService.AssertNotCalled(t, "Signup")
	})

	t.Run("Error returned from UserService", func(t *testing.T) {
		u := &models.User{
			Email:    "bob@bob.com",
			Password: "avalidpassword",
		}

		mockUserService := new(mocks.MockUserService)
		mockUserService.On("Signup", mock.AnythingOfType("*context.emptyCtx"), u).Return(apperrors.NewConflict("User Already Exists", u.Email))

		// Http response recorder
		rr := httptest.NewRecorder()

		router := gin.Default()

		handlers.NewHandler(&handlers.Config{
			R:           router,
			UserService: mockUserService,
		})

		// Create a request body
		reqBody, err := json.Marshal(gin.H{
			"email":    u.Email,
			"password": u.Password,
		})
		assert.NoError(t, err)

		// Create a reader
		request, err := http.NewRequest(http.MethodPost, "/signup", bytes.NewBuffer(reqBody))
		assert.NoError(t, err)

		request.Header.Set("Content-Type", "application/json")

		router.ServeHTTP(rr, request)

		assert.Equal(t, 409, rr.Code)
		mockUserService.AssertExpectations(t)
	})

	t.Run("Successful Token Creation", func(t *testing.T) {
		u := &models.User{
			Email:    "bob@bob.com",
			Password: "avalidpassword",
		}

		mockTokenResp := &models.TokenPair{
			IDToken:      "idToken",
			RefreshToken: "refreshToken",
		}

		mockUserService := new(mocks.MockUserService)
		mockTokenService := new(mocks.MockTokenService)

		mockUserService.
			On("Signup", mock.AnythingOfType("*context.emptyCtx"), u).
			Return(nil)
		mockTokenService.
			On("NewPairFromUser", mock.AnythingOfType("*context.emptyCtx"), u, "").
			Return(mockTokenResp, nil)

		// Http response recorder
		rr := httptest.NewRecorder()

		router := gin.Default()

		handlers.NewHandler(&handlers.Config{
			R:            router,
			UserService:  mockUserService,
			TokenService: mockTokenService,
		})

		// Create a request body
		reqBody, err := json.Marshal(gin.H{
			"email":    u.Email,
			"password": u.Password,
		})
		assert.NoError(t, err)

		// Create a reader
		request, err := http.NewRequest(http.MethodPost, "/signup", bytes.NewBuffer(reqBody))
		assert.NoError(t, err)

		request.Header.Set("Content-Type", "application/json")

		router.ServeHTTP(rr, request)

		respBody, err := json.Marshal(gin.H{
			"tokens": mockTokenResp,
		})
		assert.NoError(t, err)

		assert.Equal(t, http.StatusCreated, rr.Code)
		assert.Equal(t, respBody, rr.Body.Bytes())

		mockUserService.AssertExpectations(t)
		mockTokenService.AssertExpectations(t)
	})

	t.Run("Failed Token Creation", func(t *testing.T) {
		u := &models.User{
			Email:    "bob@bob.com",
			Password: "avalidpassword",
		}

		mockErrorResponse := apperrors.NewInternal()

		mockUserService := new(mocks.MockUserService)
		mockTokenService := new(mocks.MockTokenService)

		mockUserService.
			On("Signup", mock.AnythingOfType("*context.emptyCtx"), u).
			Return(nil)
		mockTokenService.
			On("NewPairFromUser", mock.AnythingOfType("*context.emptyCtx"), u, "").
			Return(nil, mockErrorResponse)

		// Http response recorder
		rr := httptest.NewRecorder()

		router := gin.Default()

		handlers.NewHandler(&handlers.Config{
			R:            router,
			UserService:  mockUserService,
			TokenService: mockTokenService,
		})

		// Create a request body
		reqBody, err := json.Marshal(gin.H{
			"email":    u.Email,
			"password": u.Password,
		})
		assert.NoError(t, err)

		// Create a reader
		request, err := http.NewRequest(http.MethodPost, "/signup", bytes.NewBuffer(reqBody))
		assert.NoError(t, err)

		request.Header.Set("Content-Type", "application/json")

		router.ServeHTTP(rr, request)

		respBody, err := json.Marshal(gin.H{
			"error": mockErrorResponse,
		})
		assert.NoError(t, err)

		assert.Equal(t, mockErrorResponse.Status(), rr.Code)
		assert.Equal(t, respBody, rr.Body.Bytes())

		mockUserService.AssertExpectations(t)
		mockTokenService.AssertExpectations(t)
	})
}
