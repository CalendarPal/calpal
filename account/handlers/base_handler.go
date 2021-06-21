package handlers

import (
	"net/http"
	"time"

	"github.com/CalendarPal/calpal-api/account/middlewares"
	"github.com/CalendarPal/calpal-api/account/models"
	"github.com/CalendarPal/calpal-api/account/utils/apperrors"
	"github.com/gin-gonic/gin"
)

// Handler Holds required services for the handler to function
type Handler struct {
	UserService  models.UserService
	TokenService models.TokenService
}

// Config Holds services that will be injected into the handler layer on handler initialization
type Config struct {
	R               *gin.Engine
	UserService     models.UserService
	TokenService    models.TokenService
	BaseURL         string
	TimeoutDuration time.Duration
}

// NewHandler Initializes the handler with the required injected services and the http routes
func NewHandler(c *Config) { // Create the handler
	h := &Handler{
		UserService:  c.UserService,
		TokenService: c.TokenService,
	}

	// Create the account group
	g := c.R.Group(c.BaseURL)

	if gin.Mode() != gin.TestMode {
		g.Use(middlewares.Timeout(c.TimeoutDuration, apperrors.NewServiceUnavailable()))
		g.GET("/me", middlewares.AuthUser(h.TokenService), h.Me)
		g.POST("/signout", middlewares.AuthUser(h.TokenService), h.Signout)
		g.PUT("/details", middlewares.AuthUser(h.TokenService), h.Details)
	} else {
		g.GET("/me", h.Me)
		g.POST("/signout", h.Signout)
		g.PUT("/details", h.Details)
	}

	g.POST("/signup", h.Signup)
	g.POST("/signin", h.Signin)
	g.POST("/tokens", h.Tokens)
	g.POST("/image", h.Image)
	g.DELETE("/image", h.DeleteImage)
}

func (h *Handler) Image(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"this is": "image",
	})
}

func (h *Handler) DeleteImage(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"this is": "deleteImage",
	})
}
