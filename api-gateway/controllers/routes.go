package controllers

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/sharukat/swanlake/models"
)

func LoadRoutes() *chi.Mux {
	router := chi.NewRouter()
	router.Use(middleware.Logger)
	router.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	router.Route("/mongodb", loadMongoDBRoutes)
	return router
}

func loadMongoDBRoutes(router chi.Router) {
	mongoDBHandler := models.MongoDBHandler{}
	// router.Post("/", mongoDBHandler.Create)
	router.Get("/list/{name}", mongoDBHandler.List)
	// router.Put("/{name}", mongoDBHandler.UpdateByName)
	// router.Delete("/{name}", mongoDBHandler.DeleteByName)
}
