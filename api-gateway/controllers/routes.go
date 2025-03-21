package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/sharukat/swanlake/services/google"
	"github.com/sharukat/swanlake/services/mongo"
)

type CombinedResult struct {
	BirdInfo mongo.MongoBird `json:"bird_info"`
	Images   []string        `json:"images"`
}

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
	// router.Get("/mongo/{collection}/{name}", mongoDBHandler.GetByName)
	// router.Get("/images/{name}", google.GetImages)
	router.Get("/generation/{collection}/{name}", func(w http.ResponseWriter, r *http.Request) { generationGoRoutine(w, r, mongoDBHandler) })
}

func generationGoRoutine(w http.ResponseWriter, r *http.Request, mongoDBHandler *mongo.MongoDBHandler) {

	type dbStruct struct {
		birdInfo mongo.MongoBird
		err      error
	}

	type imageStruct struct {
		images []string
		err    error
	}

	// Create channels for goroutines
	dbChannel := make(chan dbStruct)
	imageChannel := make(chan imageStruct)

	go func(ch chan<- dbStruct) {
		birdInfo, birdErr := mongoDBHandler.GetByName(w, r)
		ch <- dbStruct{birdInfo, birdErr}
	}(dbChannel)

	go func(ch chan<- imageStruct) {
		images, imageErr := google.GetImages(w, r)
		ch <- imageStruct{images, imageErr}
	}(imageChannel)

	dbResult := <-dbChannel
	imageResult := <-imageChannel

	if dbResult.err != nil {
		http.Error(w, fmt.Sprintf("Error fetching bird info: %v", dbResult.err), http.StatusInternalServerError)
		return
	}

	if imageResult.err != nil {
		http.Error(w, fmt.Sprintf("Error fetching bird images: %v", imageResult.err), http.StatusInternalServerError)
		return
	}

	result := CombinedResult{
		BirdInfo: dbResult.birdInfo,
		Images:   imageResult.images,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(result); err != nil {
		http.Error(w, fmt.Sprintf("Error encoding response: %v", err), http.StatusInternalServerError)
	}
}
