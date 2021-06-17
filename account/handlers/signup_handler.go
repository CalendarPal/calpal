package handlers

import (
	"log"

	"github.com/CalendarPal/calpal-api/account/models"
	"github.com/CalendarPal/calpal-api/account/utils/apperrors"
	"github.com/CalendarPal/calpal-api/account/utils/data"
	"github.com/gin-gonic/gin"
)

// signupRequest is not exported, it is used for json marshalling and validation
type signupRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,gte=6,lte=30"`
}

// Signup handler
func (h *Handler) Signup(c *gin.Context) {
	
	// Variable to hold the incoming json body {email, password}
	var req signupRequest

	// Bind incoming json to the struct and check for validation errors
	if ok := data.BindData(c, &req); !ok {
		return
	}

	u := &models.User{
		Email:    req.Email,
		Password: req.Password,
	}

	err := h.UserService.Signup(c, u)

	if err != nil {
		log.Printf("Failed to sign up user: %v\n", err.Error())
		c.JSON(apperrors.Status(err), gin.H{
			"error": err,
		})
		return
	}
}
