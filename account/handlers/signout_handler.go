package handlers

import (
	"github.com/CalendarPal/calpal/account/models"
	"github.com/CalendarPal/calpal/account/utils/apperrors"
	"github.com/gin-gonic/gin"
	"net/http"
)

// Signout handler
func (h *Handler) Signout(c *gin.Context) {
	user := c.MustGet("user")

	ctx := c.Request.Context()
	if err := h.TokenService.Signout(ctx, user.(*models.User).UID); err != nil {
		c.JSON(apperrors.Status(err), gin.H{
			"error": err,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "user signed out successfully",
	})
}
