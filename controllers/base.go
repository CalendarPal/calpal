package controllers

import (
	"fmt"
	"log"
	"net/http"

	"github.com/CalendarPal/calpal-api/models"
	"github.com/go-chi/chi"
	"github.com/spf13/viper"
	"gorm.io/gorm"

	"gorm.io/driver/postgres"
)

type Server struct {
	DB     *gorm.DB
	Router *chi.Mux
}

func (server *Server) Initialize() {

	var err error
	Dbdriver := "postgres"
	dbConnect := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Europe/Dublin",
		viper.GetString("db.host"), viper.GetString("db.user"),
		viper.GetString("db.pass"), viper.GetString("db.name"),
		viper.GetString("db.port"),
	)
	server.DB, err = gorm.Open(postgres.Open(dbConnect), &gorm.Config{DisableForeignKeyConstraintWhenMigrating: true})
	if err != nil {
		fmt.Printf("Cannot connect to %s database", Dbdriver)
		log.Fatal("This is the error:", err)
	} else {
		fmt.Printf("We are connected to the %s database", Dbdriver)
	}

	server.DB.Debug().AutoMigrate(&models.User{}, &models.Event{}) //database migration

	server.Router = chi.NewRouter()

	server.initializeRoutes()
}

func (server *Server) Run(addr string) {
	fmt.Println("Listening to port 8080")
	log.Fatal(http.ListenAndServe(addr, server.Router))
}
