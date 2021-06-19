package handlertests

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/CalendarPal/calpal-api/account/handlers"
	"github.com/CalendarPal/calpal-api/account/models"
	"github.com/CalendarPal/calpal-api/account/tests/mocks"
	"github.com/CalendarPal/calpal-api/account/utils/apperrors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestMe(t *testing.T) {
	// Setup
	gin.SetMode(gin.TestMode)

	t.Run("Success", func(t *testing.T) {
		uid, _ := uuid.NewRandom()

		mockUserResp := &models.User{
			UID:   uid,
			Email: "bob@bob.com",
			Name:  "Bobby Bobson",
		}

		mockUserService := new(mocks.MockUserService)
		mockUserService.On("Get", mock.AnythingOfType("*context.emptyCtx"), uid).Return(mockUserResp, nil)

		// Http response recorder
		rr := httptest.NewRecorder()

		// The only thing that matters for the test is the UID
		router := gin.Default()
		router.Use(func(c *gin.Context) {
			c.Set("user", &models.User{
				UID: uid,
			},
			)
		})

		handlers.NewHandler(&handlers.Config{
			R:           router,
			UserService: mockUserService,
		})

		request, err := http.NewRequest(http.MethodGet, "/me", nil)
		assert.NoError(t, err)

		router.ServeHTTP(rr, request)

		respBody, err := json.Marshal(gin.H{
			"user": mockUserResp,
		})
		assert.NoError(t, err)

		assert.Equal(t, http.StatusOK, rr.Code)
		assert.Equal(t, respBody, rr.Body.Bytes())
		mockUserService.AssertExpectations(t)
	})

	t.Run("NoContextUser", func(t *testing.T) {
		mockUserService := new(mocks.MockUserService)
		mockUserService.On("Get", mock.Anything, mock.Anything).Return(nil, nil)

		// Http response recorder
		rr := httptest.NewRecorder()

		router := gin.Default()
		handlers.NewHandler(&handlers.Config{
			R:           router,
			UserService: mockUserService,
		})

		request, err := http.NewRequest(http.MethodGet, "/me", nil)
		assert.NoError(t, err)

		router.ServeHTTP(rr, request)

		assert.Equal(t, http.StatusInternalServerError, rr.Code)
		mockUserService.AssertNotCalled(t, "Get", mock.Anything)
	})

	t.Run("NotFound", func(t *testing.T) {
		uid, _ := uuid.NewRandom()
		mockUserService := new(mocks.MockUserService)
		mockUserService.On("Get", mock.Anything, uid).Return(nil, fmt.Errorf("Some error down call chain"))

		// Http response recorder
		rr := httptest.NewRecorder()

		router := gin.Default()
		router.Use(func(c *gin.Context) {
			c.Set("user", &models.User{
				UID: uid,
			},
			)
		})

		handlers.NewHandler(&handlers.Config{
			R:           router,
			UserService: mockUserService,
		})

		request, err := http.NewRequest(http.MethodGet, "/me", nil)
		assert.NoError(t, err)

		router.ServeHTTP(rr, request)

		respErr := apperrors.NewNotFound("user", uid.String())

		respBody, err := json.Marshal(gin.H{
			"error": respErr,
		})
		assert.NoError(t, err)

		assert.Equal(t, respErr.Status(), rr.Code)
		assert.Equal(t, respBody, rr.Body.Bytes())
		mockUserService.AssertExpectations(t)
	})
}
