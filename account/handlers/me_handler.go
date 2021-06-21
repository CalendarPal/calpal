package handlers

import (
	"log"
	"net/http"

	"github.com/CalendarPal/calpal-api/account/models"
	"github.com/CalendarPal/calpal-api/account/utils/apperrors"
	"github.com/gin-gonic/gin"
)

// Me handler calls services to get the users details
func (h *Handler) Me(c *gin.Context) {
	user, exists := c.Get("user")

	// This should never happen due to the middleware throwing an error but ill leave it here for extra safety
	if !exists {
		log.Printf("Unable to extract user from the request context: %v\n", c)
		err := apperrors.NewInternal()
		c.JSON(err.Status(), gin.H{
			"error": err,
		})

		return
	}

	uid := user.(*models.User).UID

	// gin.Context satisfies the go context.Context interface
	ctx := c.Request.Context()
	u, err := h.UserService.Get(ctx, uid)

	if err != nil {
		log.Printf("Unable to find user: %v\n%v", uid, err)
		e := apperrors.NewNotFound("user", uid.String())

		c.JSON(e.Status(), gin.H{
			"error": e,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": u,
	})
}
