package middlewaretests

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/CalendarPal/calpal/account-server/middlewares"
	"github.com/CalendarPal/calpal/account-server/models"
	"github.com/CalendarPal/calpal/account-server/tests/mocks"
	"github.com/CalendarPal/calpal/account-server/utils/apperrors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func TestAuthUser(t *testing.T) {
	gin.SetMode(gin.TestMode)

	mockTokenService := new(mocks.MockTokenService)

	uid, _ := uuid.NewRandom()
	u := &models.User{
		UID:   uid,
		Email: "bob@bob.com",
	}

	// Since tokenService is mocked, we dont need real JWT's
	validTokenHeader := "validTokenString"
	invalidTokenHeader := "invalidTokenString"
	invalidTokenErr := apperrors.NewAuthorization("Unable to verify user from idToken")

	mockTokenService.On("ValidateIDToken", validTokenHeader).Return(u, nil)
	mockTokenService.On("ValidateIDToken", invalidTokenHeader).Return(nil, invalidTokenErr)

	t.Run("Adds a user to context", func(t *testing.T) {
		rr := httptest.NewRecorder()

		// Creates a test context and gin engine
		_, r := gin.CreateTestContext(rr)

		var contextUser *models.User

		r.GET("/me", middlewares.AuthUser(mockTokenService), func(c *gin.Context) {
			contextKeyVal, _ := c.Get("user")
			contextUser = contextKeyVal.(*models.User)
		})

		request, _ := http.NewRequest(http.MethodGet, "/me", http.NoBody)

		request.Header.Set("Authorization", fmt.Sprintf("Bearer %s", validTokenHeader))
		r.ServeHTTP(rr, request)

		assert.Equal(t, http.StatusOK, rr.Code)
		assert.Equal(t, u, contextUser)

		mockTokenService.AssertCalled(t, "ValidateIDToken", validTokenHeader)
	})

	t.Run("Invalid Token", func(t *testing.T) {
		rr := httptest.NewRecorder()

		// Creates a test context and gin engine
		_, r := gin.CreateTestContext(rr)

		r.GET("/me", middlewares.AuthUser(mockTokenService))

		request, _ := http.NewRequest(http.MethodGet, "/me", http.NoBody)

		request.Header.Set("Authorization", fmt.Sprintf("Bearer %s", invalidTokenHeader))
		r.ServeHTTP(rr, request)

		assert.Equal(t, http.StatusUnauthorized, rr.Code)
		mockTokenService.AssertCalled(t, "ValidateIDToken", invalidTokenHeader)
	})

	t.Run("Missing Authorization Header", func(t *testing.T) {
		rr := httptest.NewRecorder()

		// Creates a test context and gin engine
		_, r := gin.CreateTestContext(rr)

		r.GET("/me", middlewares.AuthUser(mockTokenService))

		request, _ := http.NewRequest(http.MethodGet, "/me", http.NoBody)

		r.ServeHTTP(rr, request)

		assert.Equal(t, http.StatusUnauthorized, rr.Code)
		mockTokenService.AssertNotCalled(t, "ValidateIDToken")
	})
}
