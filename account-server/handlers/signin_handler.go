package handlers

import (
	"log"
	"net/http"

	"github.com/CalendarPal/calpal/account-server/models"
	"github.com/CalendarPal/calpal/account-server/utils/apperrors"
	"github.com/CalendarPal/calpal/account-server/utils/data"
	"github.com/gin-gonic/gin"
)

type signinRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,gte=6,lte=30"`
}

// Signin handler
func (h *Handler) Signin(c *gin.Context) {
	var req signinRequest

	if ok := data.BindData(c, &req); !ok {
		return
	}

	u := &models.User{
		Email:    req.Email,
		Password: req.Password,
	}
	ctx := c.Request.Context()
	err := h.UserService.Signin(ctx, u)

	if err != nil {
		log.Printf("Failed to sign in user: %v\n", err.Error())
		c.JSON(apperrors.Status(err), gin.H{
			"error": err,
		})
		return
	}

	tokens, err := h.TokenService.NewPairFromUser(ctx, u, "")

	if err != nil {
		log.Printf("Failed to create tokens for user: %v\n", err.Error())

		c.JSON(apperrors.Status(err), gin.H{
			"error": err,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"tokens": tokens,
	})
}
