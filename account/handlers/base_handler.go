package handlers

import (
	"net/http"
	"os"

	"github.com/CalendarPal/calpal-api/account/models"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	UserService models.UserService
}

type Config struct {
	R           *gin.Engine
	UserService models.UserService
}

func NewHandler(c *Config) {

	h := &Handler{
		UserService: c.UserService,
	}

	g := c.R.Group(os.Getenv("ACCOUNT_API_URL"))

	g.GET("/me", h.Me)
	g.POST("/signup", h.Signup)
	g.POST("/signin", h.Signin)
	g.POST("/signout", h.Signout)
	g.POST("/tokens", h.Tokens)
	g.POST("/image", h.Image)
	g.DELETE("/image", h.DeleteImage)
	g.PUT("/details", h.Details)
}

func (h *Handler) Signin(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"this is": "signin",
	})
}

func (h *Handler) Signout(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"this is": "signout",
	})
}

func (h *Handler) Tokens(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"this is": "tokens",
	})
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

func (h *Handler) Details(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"this is": "details",
	})
}
