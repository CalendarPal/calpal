package main

import (
	"github.com/CalendarPal/calpal-api/config"
	"github.com/CalendarPal/calpal-api/controllers"
	"github.com/CalendarPal/calpal-api/seed"
)

var server = controllers.Server{}

func main() {

	config.InitConfig()

	server.Initialize()

	seed.Load(server.DB)

	server.Run(":8080")
}
