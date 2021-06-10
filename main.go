package main

import (
	"net/http"
	"time"

	"github.com/CalendarPal/calpal-api/config"
	"github.com/CalendarPal/calpal-api/models"

	"github.com/go-chi/chi"
	"github.com/rs/cors"
)

func main() {
	r := chi.NewRouter()

	config.InitConfig()

	handler := cors.AllowAll().Handler(r)

	time.Sleep(time.Second * 2)
	models.InitModels()

	http.ListenAndServe(":8080", handler)
}
