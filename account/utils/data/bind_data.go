package data

import (
	"log"

	"github.com/CalendarPal/calpal-api/account/utils/apperrors"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

// Extract validation errors
type invalidArgument struct {
	Field string `json:"field"`
	Value string `json:"value"`
	Tag   string `json:"tag"`
	Param string `json:"param"`
}

// Helper function, returns false if data is not bound
func BindData(c *gin.Context, req interface{}) bool {

	// Bind incoming json to struct and check for validation errors
	if err := c.ShouldBind(req); err != nil {
		log.Printf("Error binding data: %+v\n", err)

		if errs, ok := err.(validator.ValidationErrors); ok {
			var invalidArgs []invalidArgument

			for _, err := range errs {
				invalidArgs = append(invalidArgs, invalidArgument{
					err.Field(),
					err.Value().(string),
					err.Tag(),
					err.Param(),
				})
			}

			err := apperrors.NewBadRequest("Invalid request parameters. See invalidArgs")

			c.JSON(err.Status(), gin.H{
				"error":       err,
				"invalidArgs": invalidArgs,
			})
			return false
		}

		// TODO: Add code for validating max body size

		// If validation errors cant be extracted, we return an internal server error as a fallback
		fallBack := apperrors.NewInternal()

		c.JSON(fallBack.Status(), gin.H{"error": fallBack})
		return false
	}

	return true
}
