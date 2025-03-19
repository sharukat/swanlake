package models

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MongoDBHandler struct{}

type MongoDBDocument struct {
	CommonName string `bson:"Common Name" json:"common_name"`
}

// func (obj *MongoDBHandler) Create(w http.ResponseWriter, r *http.Request) {
// 	fmt.Println(os.Getenv("ME_CONFIG_MONGODB_URL"))
// 	fmt.Println("Add item to MongoDB")
// }

func (obj *MongoDBHandler) List(w http.ResponseWriter, r *http.Request) {
	collectionName := chi.URLParam(r, "name")
	fmt.Println(collectionName)
	collection := mongoClient.Database(os.Getenv("MONGODB_NAME")).Collection(collectionName)

	opts := options.Find().SetSort(bson.D{{Key: "Common Name", Value: 1}})
	cursor, err := collection.Find(context.TODO(), bson.D{}, opts)
	if err != nil {
		log.Panic(err)
	}

	var results []MongoDBDocument
	if err = cursor.All(context.TODO(), &results); err != nil {
		log.Panic(err)
	}

	var commonNames []string
	for _, result := range results {
		commonNames = append(commonNames, result.CommonName)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(commonNames)
}

// func (obj *MongoDBHandler) UpdateByName(w http.ResponseWriter, r *http.Request) {
// 	fmt.Println("Update item in MongoDB")
// }

// func (obj *MongoDBHandler) DeleteByName(w http.ResponseWriter, r *http.Request) {
// 	fmt.Println("Delete item from MongoDB")
// }
