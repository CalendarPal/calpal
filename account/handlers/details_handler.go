package handlers

import (
	"github.com/CalendarPal/calpal-api/account/models"
	"github.com/CalendarPal/calpal-api/account/utils/apperrors"
	"github.com/CalendarPal/calpal-api/account/utils/data"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

type detailsRequest struct {
	Name    string `json:"name" binding:"omitempty,max=50"`
	Email   string `json:"email" binding:"required,email"`
	Website string `json:"website" binding:"omitempty,url"`
}

// Details handler
func (h *Handler) Details(c *gin.Context) {
	authUser := c.MustGet("user").(*models.User)

	var req detailsRequest

	if ok := data.BindData(c, &req); !ok {
		return
	}

	u := &models.User{
		UID:       authUser.UID,
		Name:      req.Name,
		Email:     req.Email,
		Website:   req.Website,
		CreatedAt: authUser.CreatedAt,
	}
	ctx := c.Request.Context()
	err := h.UserService.UpdateDetails(ctx, u)
	if err != nil {
		log.Printf("Failed to update user: %v\n", err.Error())
		c.JSON(apperrors.Status(err), gin.H{
			"error": err,
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"user": u,
	})
}
