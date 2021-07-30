package handlers

import (
	"log"
	"net/http"

	"github.com/CalendarPal/calpal/account-server/models"
	"github.com/CalendarPal/calpal/account-server/utils/apperrors"
	"github.com/CalendarPal/calpal/account-server/utils/data"
	"github.com/gin-gonic/gin"
)

// signupRequest is not exported, it is used for json marshalling and validation
type signupRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,gte=6,lte=30"`
}

// Signup handler
func (h *Handler) Signup(c *gin.Context) { // Variable to hold the incoming json body {email, password}
	var req signupRequest

	// Bind incoming json to the struct and check for validation errors
	if ok := data.BindData(c, &req); !ok {
		return
	}

	u := &models.User{
		Email:    req.Email,
		Password: req.Password,
	}
	ctx := c.Request.Context()
	err := h.UserService.Signup(ctx, u)

	if err != nil {
		log.Printf("Failed to sign up user: %v\n", err.Error())
		c.JSON(apperrors.Status(err), gin.H{
			"error": err,
		})
		return
	}

	// Create a token pair as strings
	tokens, err := h.TokenService.NewPairFromUser(ctx, u, "")

	if err != nil {
		log.Printf("Failed to create tokens for user: %v\n", err.Error())

		c.JSON(apperrors.Status(err), gin.H{
			"error": err,
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"tokens": tokens,
	})
}
