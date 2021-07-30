package handlers

import (
	"log"
	"net/http"

	"github.com/CalendarPal/calpal/account-server/models"
	"github.com/CalendarPal/calpal/account-server/utils/apperrors"
	"github.com/gin-gonic/gin"
)

// DeleteImage handler
func (h *Handler) DeleteImage(c *gin.Context) {
	authUser := c.MustGet("user").(*models.User)

	ctx := c.Request.Context()
	err := h.UserService.ClearProfileImage(ctx, authUser.UID)

	if err != nil {
		log.Printf("Failed to delete profile image: %v\n", err.Error())

		c.JSON(apperrors.Status(err), gin.H{
			"error": err,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
	})
}
