package handlertests

import (
	"bytes"
	"encoding/json"
	"github.com/CalendarPal/calpal/account/handlers"
	"github.com/CalendarPal/calpal/account/models"
	"github.com/CalendarPal/calpal/account/tests/mocks"
	"github.com/CalendarPal/calpal/account/utils/apperrors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestTokens(t *testing.T) {
	gin.SetMode(gin.TestMode)

	mockTokenService := new(mocks.MockTokenService)
	mockUserService := new(mocks.MockUserService)

	router := gin.Default()

	handlers.NewHandler(&handlers.Config{
		R:            router,
		TokenService: mockTokenService,
		UserService:  mockUserService,
	})

	t.Run("Invalid request", func(t *testing.T) {
		// Http response recorder
		rr := httptest.NewRecorder()

		reqBody, _ := json.Marshal(gin.H{
			"notRefreshToken": "this key is not valid for this handler!",
		})

		request, _ := http.NewRequest(http.MethodPost, "/tokens", bytes.NewBuffer(reqBody))
		request.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(rr, request)

		assert.Equal(t, http.StatusBadRequest, rr.Code)
		mockTokenService.AssertNotCalled(t, "ValidateRefreshToken")
		mockUserService.AssertNotCalled(t, "Get")
		mockTokenService.AssertNotCalled(t, "NewPairFromUser")
	})

	t.Run("Invalid token", func(t *testing.T) {
		invalidTokenString := "invalid"
		mockErrorMessage := "authProbs"
		mockError := apperrors.NewAuthorization(mockErrorMessage)

		mockTokenService.
			On("ValidateRefreshToken", invalidTokenString).
			Return(nil, mockError)

		// Http response recorder
		rr := httptest.NewRecorder()

		reqBody, _ := json.Marshal(gin.H{
			"refreshToken": invalidTokenString,
		})

		request, _ := http.NewRequest(http.MethodPost, "/tokens", bytes.NewBuffer(reqBody))
		request.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(rr, request)

		respBody, _ := json.Marshal(gin.H{
			"error": mockError,
		})

		assert.Equal(t, mockError.Status(), rr.Code)
		assert.Equal(t, respBody, rr.Body.Bytes())
		mockTokenService.AssertCalled(t, "ValidateRefreshToken", invalidTokenString)
		mockUserService.AssertNotCalled(t, "Get")
		mockTokenService.AssertNotCalled(t, "NewPairFromUser")
	})

	t.Run("Failure to create new token pair", func(t *testing.T) {
		validTokenString := "valid"
		mockTokenID, _ := uuid.NewRandom()
		mockUserID, _ := uuid.NewRandom()

		mockRefreshTokenResp := &models.RefreshToken{
			SS:  validTokenString,
			ID:  mockTokenID,
			UID: mockUserID,
		}

		mockTokenService.
			On("ValidateRefreshToken", validTokenString).
			Return(mockRefreshTokenResp, nil)

		mockUserResp := &models.User{
			UID: mockUserID,
		}
		getArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			mockRefreshTokenResp.UID,
		}

		mockUserService.
			On("Get", getArgs...).
			Return(mockUserResp, nil)

		mockError := apperrors.NewAuthorization("Invalid refresh token")
		newPairArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			mockUserResp,
			mockRefreshTokenResp.ID.String(),
		}

		mockTokenService.
			On("NewPairFromUser", newPairArgs...).
			Return(nil, mockError)

		// Http response recorder
		rr := httptest.NewRecorder()

		reqBody, _ := json.Marshal(gin.H{
			"refreshToken": validTokenString,
		})

		request, _ := http.NewRequest(http.MethodPost, "/tokens", bytes.NewBuffer(reqBody))
		request.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(rr, request)

		respBody, _ := json.Marshal(gin.H{
			"error": mockError,
		})

		assert.Equal(t, mockError.Status(), rr.Code)
		assert.Equal(t, respBody, rr.Body.Bytes())
		mockTokenService.AssertCalled(t, "ValidateRefreshToken", validTokenString)
		mockUserService.AssertCalled(t, "Get", getArgs...)
		mockTokenService.AssertCalled(t, "NewPairFromUser", newPairArgs...)
	})

	t.Run("Success", func(t *testing.T) {
		validTokenString := "anothervalid"
		mockTokenID, _ := uuid.NewRandom()
		mockUserID, _ := uuid.NewRandom()

		mockRefreshTokenResp := &models.RefreshToken{
			SS:  validTokenString,
			ID:  mockTokenID,
			UID: mockUserID,
		}

		mockTokenService.
			On("ValidateRefreshToken", validTokenString).
			Return(mockRefreshTokenResp, nil)

		mockUserResp := &models.User{
			UID: mockUserID,
		}
		getArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			mockRefreshTokenResp.UID,
		}

		mockUserService.
			On("Get", getArgs...).
			Return(mockUserResp, nil)

		mockNewTokenID, _ := uuid.NewRandom()
		mockNewUserID, _ := uuid.NewRandom()
		mockTokenPairResp := &models.TokenPair{
			IDToken: models.IDToken{SS: "aNewIDToken"},
			RefreshToken: models.RefreshToken{
				SS:  "aNewRefreshToken",
				ID:  mockNewTokenID,
				UID: mockNewUserID,
			},
		}

		newPairArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			mockUserResp,
			mockRefreshTokenResp.ID.String(),
		}

		mockTokenService.
			On("NewPairFromUser", newPairArgs...).
			Return(mockTokenPairResp, nil)

		// Http response recorder
		rr := httptest.NewRecorder()

		reqBody, _ := json.Marshal(gin.H{
			"refreshToken": validTokenString,
		})

		request, _ := http.NewRequest(http.MethodPost, "/tokens", bytes.NewBuffer(reqBody))
		request.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(rr, request)

		respBody, _ := json.Marshal(gin.H{
			"tokens": mockTokenPairResp,
		})

		assert.Equal(t, http.StatusOK, rr.Code)
		assert.Equal(t, respBody, rr.Body.Bytes())
		mockTokenService.AssertCalled(t, "ValidateRefreshToken", validTokenString)
		mockUserService.AssertCalled(t, "Get", getArgs...)
		mockTokenService.AssertCalled(t, "NewPairFromUser", newPairArgs...)
	})
}
