package controllers

import (
	"github.com/CalendarPal/calpal-api/middlewares"
	mid "github.com/go-chi/chi/middleware"
)

func (s *Server) initializeRoutes() {
	s.Router.Use(mid.Logger)
	// Home Route
	s.Router.Get("/", middlewares.SetMiddlewareJSON(s.Home))

	// Login Route
	s.Router.Post("/login", middlewares.SetMiddlewareJSON(s.Login))

	//Users routes
	s.Router.Post("/users", middlewares.SetMiddlewareJSON(s.CreateUser))
	s.Router.Get("/users", middlewares.SetMiddlewareJSON(s.GetUsers))
	s.Router.Get("/users/{id}", middlewares.SetMiddlewareJSON(s.GetUser))
	s.Router.Put("/users/{id}", middlewares.SetMiddlewareJSON(middlewares.SetMiddlewareAuthentication(s.UpdateUser)))
	s.Router.Delete("/users/{id}", middlewares.SetMiddlewareAuthentication(s.DeleteUser))

	//Events routes
	s.Router.Post("/events", middlewares.SetMiddlewareJSON(s.CreateEvent))
	s.Router.Get("/events", middlewares.SetMiddlewareJSON(s.GetEvents))
	s.Router.Get("/events/{id}", middlewares.SetMiddlewareJSON(s.GetEvent))
	s.Router.Put("/events/{id}", middlewares.SetMiddlewareJSON(middlewares.SetMiddlewareAuthentication(s.UpdateEvent)))
	s.Router.Delete("/events/{id}", middlewares.SetMiddlewareAuthentication(s.DeleteEvent))
}
