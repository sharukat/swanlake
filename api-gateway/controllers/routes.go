package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/sharukat/swanlake/services"
	"github.com/sharukat/swanlake/services/ai"
	"github.com/sharukat/swanlake/services/mongo"
	"github.com/sharukat/swanlake/utilities"
)

type CombinedResult struct {
	Response1 string   `json:"response1"`
	Response2 string   `json:"response2"`
	Images    []string `json:"images"`
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

	type searchStruct struct {
		result string
		err    error
	}

	type aiResponse struct {
		response []byte
		err      error
	}

	type Result struct {
		URL     string `json:"url"`
		Content string `json:"content"`
	}

	type Response struct {
		Query             string        `json:"query"`
		FollowUpQuestions interface{}   `json:"follow_up_questions"`
		Answer            string        `json:"answer"`
		Images            []interface{} `json:"images"`
		Results           []Result      `json:"results"`
		ResponseTime      float64       `json:"response_time"`
	}

	// Create channels for goroutines
	dbChannel := make(chan dbStruct)
	imageChannel := make(chan imageStruct)
	searchChannel := make(chan searchStruct)
	aiChannel := make(chan aiResponse)

	go func(ch chan<- dbStruct) {
		birdInfo, err := mongoDBHandler.GetByName(w, r)
		ch <- dbStruct{birdInfo, err}
		if err != nil {
			log.Fatal(err)
		}
	}(dbChannel)

	go func(ch chan<- imageStruct) {
		images, err := services.GetImages(w, r)
		ch <- imageStruct{images, err}
		if err != nil {
			log.Fatal(err)
		}
	}(imageChannel)

	go func(ch chan<- searchStruct) {
		results, err := services.WebSearch(collection, item)
		ch <- searchStruct{results, err}
	}(searchChannel)

	dbResult := <-dbChannel
	searchResult := <-searchChannel

	var data Response
	err := json.Unmarshal([]byte(searchResult.result), &data)
	if err != nil {
		fmt.Println(err)
		return
	}

	urlSet := make(map[string]bool)
	var contents []string
	for _, result := range data.Results {
		urlSet[result.URL] = true
		contents = append(contents, result.Content)
	}
	context := strings.Join(contents, "\n")

	go func(ch chan<- aiResponse) {
		dbMaped, err := utilities.StructToMap(dbResult.birdInfo)
		if err != nil {
			log.Printf("Error converting struct to map: %v", err)
		}
		res, err := ai.GetAssistant(ai.InputData{
			Collection: collection,
			Item:       item,
			DBData:     dbMaped,
			Context:    context,
		})
		if err != nil {
			log.Printf("Error fetching from AI service: %v", err)
		}
		ch <- aiResponse{res, nil}
	}(aiChannel)

	aiResult := <-aiChannel
	// fmt.Println(aiResult.response)
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

	var result map[string]interface{}
	ai_err := json.Unmarshal(aiResult.response, &result)
	if ai_err != nil {
		log.Fatalf("failed to unmarshal AI response: %v", ai_err)
	}

	response1, _ := result["response1"].(string)
	response2, _ := result["response2"].(string)

	results := CombinedResult{
		Response1: response1,
		Response2: response2,
		Images:    imageResult.images,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(results); err != nil {
		http.Error(w, fmt.Sprintf("Error encoding response: %v", err), http.StatusInternalServerError)
	}
}
