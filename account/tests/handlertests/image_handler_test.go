package handlertests

import (
	"encoding/json"
	"github.com/CalendarPal/calpal-api/account/handlers"
	"github.com/CalendarPal/calpal-api/account/models"
	"github.com/CalendarPal/calpal-api/account/tests/fixtures"
	"github.com/CalendarPal/calpal-api/account/tests/mocks"
	"github.com/CalendarPal/calpal-api/account/utils/apperrors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestImage(t *testing.T) {
	// Setup
	gin.SetMode(gin.TestMode)

	uid, _ := uuid.NewRandom()
	ctxUser := models.User{
		UID: uid,
	}

	router := gin.Default()
	router.Use(func(c *gin.Context) {
		c.Set("user", &ctxUser)
	})

	mockUserService := new(mocks.MockUserService)

	handlers.NewHandler(&handlers.Config{
		R:            router,
		UserService:  mockUserService,
		MaxBodyBytes: 4 * 1024 * 1024,
	})

	t.Run("Success", func(t *testing.T) {
		rr := httptest.NewRecorder()

		imageURL := "https://www.imageURL.com/1234"

		multipartImageFixture := fixtures.NewMultipartImage("image.png", "image/png")
		defer multipartImageFixture.Close()

		setProfileImageArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			ctxUser.UID,
			mock.AnythingOfType("*multipart.FileHeader"),
		}

		updatedUser := ctxUser
		updatedUser.ImageURL = imageURL

		mockUserService.On("SetProfileImage", setProfileImageArgs...).Return(&updatedUser, nil)

		request, _ := http.NewRequest(http.MethodPost, "/image", multipartImageFixture.MultipartBody)
		request.Header.Set("Content-Type", multipartImageFixture.ContentType)

		router.ServeHTTP(rr, request)

		respBody, _ := json.Marshal(gin.H{
			"imageUrl": imageURL,
			"message":  "success",
		})

		assert.Equal(t, http.StatusOK, rr.Code)
		assert.Equal(t, respBody, rr.Body.Bytes())

		mockUserService.AssertCalled(t, "SetProfileImage", setProfileImageArgs...)
	})

	t.Run("Disallowed mimetype", func(t *testing.T) {
		rr := httptest.NewRecorder()

		multipartImageFixture := fixtures.NewMultipartImage("image.txt", "mage/svg+xml")
		defer multipartImageFixture.Close()

		request, _ := http.NewRequest(http.MethodPost, "/image", multipartImageFixture.MultipartBody)
		request.Header.Set("Content-Type", "multipart/form-data")

		router.ServeHTTP(rr, request)

		assert.Equal(t, http.StatusBadRequest, rr.Code)

		mockUserService.AssertNotCalled(t, "SetProfileImage")
	})

	t.Run("No image file provided", func(t *testing.T) {
		rr := httptest.NewRecorder()

		request, _ := http.NewRequest(http.MethodPost, "/image", nil)
		request.Header.Set("Content-Type", "multipart/form-data")

		router.ServeHTTP(rr, request)

		assert.Equal(t, http.StatusBadRequest, rr.Code)

		mockUserService.AssertNotCalled(t, "SetProfileImage")
	})

	t.Run("Error from SetProfileImage", func(t *testing.T) {
		uid, _ := uuid.NewRandom()
		ctxUser := models.User{
			UID: uid,
		}

		router := gin.Default()
		router.Use(func(c *gin.Context) {
			c.Set("user", &ctxUser)
		})

		mockUserService := new(mocks.MockUserService)

		handlers.NewHandler(&handlers.Config{
			R:            router,
			UserService:  mockUserService,
			MaxBodyBytes: 4 * 1024 * 1024,
		})

		rr := httptest.NewRecorder()

		multipartImageFixture := fixtures.NewMultipartImage("image.png", "image/png")
		defer multipartImageFixture.Close()

		setProfileImageArgs := mock.Arguments{
			mock.AnythingOfType("*context.emptyCtx"),
			ctxUser.UID,
			mock.AnythingOfType("*multipart.FileHeader"),
		}

		mockError := apperrors.NewInternal()

		mockUserService.On("SetProfileImage", setProfileImageArgs...).Return(nil, mockError)

		request, _ := http.NewRequest(http.MethodPost, "/image", multipartImageFixture.MultipartBody)
		request.Header.Set("Content-Type", multipartImageFixture.ContentType)

		router.ServeHTTP(rr, request)

		assert.Equal(t, apperrors.Status(mockError), rr.Code)

		mockUserService.AssertCalled(t, "SetProfileImage", setProfileImageArgs...)
	})
}
