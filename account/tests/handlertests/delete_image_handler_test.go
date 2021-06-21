package handlertests

import (
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

func TestDeleteImage(t *testing.T) {
	// Setup
	gin.SetMode(gin.TestMode)

	uid, _ := uuid.NewRandom()
	ctxUser := &models.User{
		UID: uid,
	}

	router := gin.Default()
	router.Use(func(c *gin.Context) {
		c.Set("user", ctxUser)
	})

	mockUserService := new(mocks.MockUserService)

	handlers.NewHandler(&handlers.Config{
		R:           router,
		UserService: mockUserService,
	})

	t.Run("Clear profile image error", func(t *testing.T) {
		rr := httptest.NewRecorder()

		clearProfileImageArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			ctxUser.UID,
		}

		errorResp := apperrors.NewInternal()
		mockUserService.On("ClearProfileImage", clearProfileImageArgs...).Return(errorResp)

		request, _ := http.NewRequest(http.MethodDelete, "/image", nil)
		router.ServeHTTP(rr, request)

		respBody, _ := json.Marshal(gin.H{
			"error": errorResp,
		})

		assert.Equal(t, apperrors.Status(errorResp), rr.Code)
		assert.Equal(t, respBody, rr.Body.Bytes())
		mockUserService.AssertCalled(t, "ClearProfileImage", clearProfileImageArgs...)
	})

	t.Run("Success", func(t *testing.T) {
		rr := httptest.NewRecorder()

		uid, _ := uuid.NewRandom()
		ctxUser := &models.User{
			UID: uid,
		}

		router := gin.Default()
		router.Use(func(c *gin.Context) {
			c.Set("user", ctxUser)
		})

		mockUserService := new(mocks.MockUserService)

		handlers.NewHandler(&handlers.Config{
			R:           router,
			UserService: mockUserService,
		})

		clearProfileImageArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			ctxUser.UID,
		}

		mockUserService.On("ClearProfileImage", clearProfileImageArgs...).Return(nil)

		request, _ := http.NewRequest(http.MethodDelete, "/image", nil)
		router.ServeHTTP(rr, request)

		assert.Equal(t, http.StatusOK, rr.Code)
		mockUserService.AssertCalled(t, "ClearProfileImage", clearProfileImageArgs...)
	})
}
