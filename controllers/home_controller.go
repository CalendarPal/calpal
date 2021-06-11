package controllers

import (
	"net/http"

	"github.com/CalendarPal/calpal-api/responses"
)

func (server *Server) Home(w http.ResponseWriter, r *http.Request) {
	responses.JSON(w, http.StatusOK, "This is the CalPal API")
}
