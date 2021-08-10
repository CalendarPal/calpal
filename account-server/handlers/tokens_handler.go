package handlers

import (
	"log"
	"net/http"

	"github.com/CalendarPal/calpal/account-server/utils/apperrors"
	"github.com/CalendarPal/calpal/account-server/utils/data"
	"github.com/gin-gonic/gin"
)

type tokensRequest struct {
	RefreshToken string `json:"refreshToken" binding:"required"`
}

// Tokens handler
func (h *Handler) Tokens(c *gin.Context) { // Bind incoming JSON to request of type tokensRequest
	var req tokensRequest

	if ok := data.BindData(c, &req); !ok {
		return
	}

	ctx := c.Request.Context()

	// Verify refresh JWT
	refreshToken, err := h.TokenService.ValidateRefreshToken(req.RefreshToken)

	if err != nil {
		c.JSON(apperrors.Status(err), gin.H{
			"error": err,
		})
		return
	}

	// Get up-to-date user
	u, err := h.UserService.Get(ctx, refreshToken.UID)

	if err != nil {
		c.JSON(apperrors.Status(err), gin.H{
			"error": err,
		})
		return
	}

	// Create fresh pair of tokens
	tokens, err := h.TokenService.NewPairFromUser(ctx, u, refreshToken.ID.String())

	if err != nil {
		log.Printf("Failed to create tokens for user: %+v. Error: %v\n", u, err.Error())

		c.JSON(apperrors.Status(err), gin.H{
			"error": err,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"tokens": tokens,
	})
}
