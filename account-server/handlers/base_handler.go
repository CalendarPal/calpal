package handlers

import (
	"time"

	"github.com/CalendarPal/calpal/account-server/middlewares"
	"github.com/CalendarPal/calpal/account-server/models"
	"github.com/CalendarPal/calpal/account-server/utils/apperrors"
	"github.com/gin-gonic/gin"
)

// Handler Holds required services for the handler to function
type Handler struct {
	UserService  models.UserService
	TokenService models.TokenService
	MaxBodyBytes int64
}

// Config Holds services that will be injected into the handler layer on handler initialization
type Config struct {
	R               *gin.Engine
	UserService     models.UserService
	TokenService    models.TokenService
	BaseURL         string
	TimeoutDuration time.Duration
	MaxBodyBytes    int64
}

// NewHandler Initializes the handler with the required injected services and the http routes
func NewHandler(c *Config) { // Create the handler
	h := &Handler{
		UserService:  c.UserService,
		TokenService: c.TokenService,
		MaxBodyBytes: c.MaxBodyBytes,
	}

	// Create the account group
	g := c.R.Group(c.BaseURL)

	if gin.Mode() != gin.TestMode {
		g.Use(middlewares.Timeout(c.TimeoutDuration, apperrors.NewServiceUnavailable()))
		g.GET("/me", middlewares.AuthUser(h.TokenService), h.Me)
		g.POST("/signout", middlewares.AuthUser(h.TokenService), h.Signout)
		g.PUT("/details", middlewares.AuthUser(h.TokenService), h.Details)
		g.POST("/image", middlewares.AuthUser(h.TokenService), h.UploadImage)
		g.DELETE("/image", middlewares.AuthUser(h.TokenService), h.DeleteImage)
	} else {
		g.GET("/me", h.Me)
		g.POST("/signout", h.Signout)
		g.PUT("/details", h.Details)
		g.POST("/image", h.UploadImage)
		g.DELETE("/image", h.DeleteImage)
	}
	g.POST("/signup", h.Signup)
	g.POST("/signin", h.Signin)
	g.POST("/tokens", h.Tokens)
}
