package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/sharukat/swanlake/services/ai"
	"github.com/sharukat/swanlake/services/google"
	"github.com/sharukat/swanlake/services/mongo"
	"github.com/sharukat/swanlake/utilities"
)

type CombinedResult struct {
	BirdInfo mongo.MongoBird `json:"bird_info"`
	Images   []string        `json:"images"`
	// AIResponse interface{}     `json:"ai_response"`
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
	router.Get("/generation/{collection}/{name}", func(w http.ResponseWriter, r *http.Request) {
		generation(w, r, mongoDBHandler)
	})
}

func generation(w http.ResponseWriter, r *http.Request, handler *mongo.MongoDBHandler) {
	collectionName := chi.URLParam(r, "collection")
	itemName := chi.URLParam(r, "name")
	generationGoRoutine(w, r, handler, collectionName, itemName)
}

func generationGoRoutine(w http.ResponseWriter, r *http.Request, mongoDBHandler *mongo.MongoDBHandler, collection string, item string) {

	type dbStruct struct {
		birdInfo mongo.MongoBird
		err      error
	}

	type imageStruct struct {
		images []string
		err    error
	}

	type aiResponse struct {
		response string
		err      error
	}

	// Create channels for goroutines
	dbChannel := make(chan dbStruct)
	imageChannel := make(chan imageStruct)
	aiChannel := make(chan aiResponse)

	go func(ch chan<- dbStruct) {
		birdInfo, err := mongoDBHandler.GetByName(w, r)
		ch <- dbStruct{birdInfo, err}
		if err != nil {
			log.Fatal(err)
		}
	}(dbChannel)

	go func(ch chan<- imageStruct) {
		images, err := google.GetImages(w, r)
		ch <- imageStruct{images, err}
		if err != nil {
			log.Fatal(err)
		}
	}(imageChannel)

	dbResult := <-dbChannel
	// dbMaped, err := utilities.StructToMap(dbResult.birdInfo)
	// if err != nil {
	// 	log.Printf("Error converting struct to map: %v", err)
	// }

	go func(ch chan<- aiResponse) {
		dbMaped, err := utilities.StructToMap(dbResult.birdInfo)
		fmt.Printf("Converted DBMap: %+v\n", dbMaped)
		if err != nil {
			log.Printf("Error converting struct to map: %v", err)
		}
		res, err := ai.GetAssistant(ai.InputData{
			Collection: collection,
			Item:       item,
			DBData:     dbMaped,
		})
		if err != nil {
			log.Printf("Error fetching from AI service: %v", err)
		}
		ch <- aiResponse{res, nil}
	}(aiChannel)

	aiResult := <-aiChannel
	fmt.Println(aiResult.response)
	imageResult := <-imageChannel

	if dbResult.err != nil {
		http.Error(w, fmt.Sprintf("Error fetching bird info: %v", dbResult.err), http.StatusInternalServerError)
		return
	}

	if imageResult.err != nil {
		http.Error(w, fmt.Sprintf("Error fetching bird images: %v", imageResult.err), http.StatusInternalServerError)
		return
	}

	if aiResult.err != nil {
		http.Error(w, fmt.Sprintf("Error fetching assistant response: %v", aiResult.err), http.StatusInternalServerError)
		return
	}

	result := CombinedResult{
		BirdInfo: dbResult.birdInfo,
		Images:   imageResult.images,
		// AIResponse: aiResult.assistantRes,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(result); err != nil {
		http.Error(w, fmt.Sprintf("Error encoding response: %v", err), http.StatusInternalServerError)
	}
}
