package controllers

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/sharukat/swanlake/services/google"
	"github.com/sharukat/swanlake/services/mongo"
)

func LoadRoutes() *chi.Mux {
	router := chi.NewRouter()
	router.Use(middleware.Logger)
	router.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	router.Route("/api", loadServiceRoutes)
	return router
}

func loadServiceRoutes(router chi.Router) {
	mongoClient := mongo.InitMongoClient()

	// Handlers
	mongoDBHandler := mongo.InitDB(mongoClient)

	// Routes
	router.Get("/mongo/list/{collection}", mongoDBHandler.List)
	router.Get("/mongo/{collection}/{name}", mongoDBHandler.GetByName)
	router.Get("/images/{name}", google.GetImages)
}
