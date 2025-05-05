package mongo

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MongoDBHandler struct {
	Client     *mongo.Client
	Database   string
	Context    context.Context
	CancelFunc context.CancelFunc
}

func InitDB(dbClient *mongo.Client) *MongoDBHandler {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	return &MongoDBHandler{
		Client:     dbClient,
		Database:   os.Getenv("MONGODB_NAME"),
		Context:    ctx,
		CancelFunc: cancel,
	}
}

type MongoDBDocument struct {
	CommonName string `bson:"Common Name" json:"common_name"`
}

type MongoBird struct {
	CommonName          string `bson:"Common Name" json:"common_name"`
	ScientificName      string `bson:"Scientific Name" json:"scientific_name"`
	NatureCount1        string `bson:"Nature Counts Grouping (1)" json:"nature_count_1"`
	NatureCount2        string `bson:"Nature Counts Grouping (2)" json:"nature_count_2"`
	NatureCount3        string `bson:"Nature Counts Grouping (3)" json:"nature_count_3"`
	TRCARank1           string `bson:"TRCA L-Rank" json:"trca_l_rank1"`
	TRCARank2           string `bson:"TRCA L-Rank2" json:"trca_l_rank2"`
	EbirdFamily         string `bson:"ebird Family Category" json:"ebird_family"`
	Code                string `bson:"Code" json:"code"`
	Habitat             string `bson:"Habitat" json:"habitat"`
	LocalOccurance      string `bson:"Local Occurance" json:"local_occurance"`
	NationalPoplTrend   string `bson:"National Popl Trend" json:"national_popl_trend"`
	TRCAPoplTrend       string `bson:"TRCA Popl Trend" json:"trca_popl_trend"`
	AreaSensitivity     string `bson:"Area Sensitivity" json:"area_sensitivity"`
	PatchIsoSensitivity string `bson:"Patch Isolation Sensitivity" json:"patch_isolation_sensitivity"`
	SensitivityToDevl   string `bson:"Sensitivity to Devl'm" json:"sensitivity_to_devl"`
	HabitatDependence   string `bson:"Habitat Dependence" json:"habitat_dependence"`
	Breeding2020        string `bson:"Breeding 2020" json:"breeding_2020"`
	GlobalGRank         string `bson:"Global G-Rank" json:"global_g_rank"`
	OntarioSRank        string `bson:"Ontario S-Rank" json:"ontario_s_rank"`
	CanadaCOSEWIC       string `bson:"Canada COSEWIC" json:"canada_cosewic"`
	Obs1991SwanL        string `bson:"Observed 1991 SwanL" json:"observed_1991_swanl"`
	Obs2020SwanL        string `bson:"Observed 2020 SwanL" json:"observed_2020_swanl"`
	Obs2024SwanL        string `bson:"Observed 2024 SwanL" json:"observed_2024_swanl"`
}

type CreateRecord struct {
	Category     string `json:"category"`
	CommonName   string `json:"common_name"`
	ObservedDate string `json:"observed_date"`
	NatureGroup  string `json:"nature_group"`
}

type CreateResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

func (h *MongoDBHandler) GetCollection(name string) *mongo.Collection {
	return h.Client.Database(h.Database).Collection(name)
}

func (h *MongoDBHandler) List(w http.ResponseWriter, r *http.Request) {
	collectionName := chi.URLParam(r, "collection")
	collection := h.GetCollection(collectionName)
	ctx := r.Context()

	opts := options.Find().SetSort(bson.D{{Key: "Common Name", Value: 1}})
	cursor, err := collection.Find(ctx, bson.D{}, opts)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to query database: %v", err), http.StatusInternalServerError)
		return
	}
	defer cursor.Close(h.Context)

	var results []MongoDBDocument
	if err = cursor.All(ctx, &results); err != nil {
		http.Error(w, fmt.Sprintf("Failed to decode results: %v", err), http.StatusInternalServerError)
		return
	}

	var commonNames []string
	for _, result := range results {
		commonNames = append(commonNames, result.CommonName)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(commonNames)
}

func (h *MongoDBHandler) GetByName(w http.ResponseWriter, r *http.Request) (MongoBird, error) {
	collectionName := chi.URLParam(r, "collection")
	itemName := chi.URLParam(r, "name")
	ctx := r.Context()

	collection := h.GetCollection(collectionName)
	filter := bson.D{{Key: "Common Name", Value: itemName}}

	var result MongoBird
	err := collection.FindOne(ctx, filter).Decode(&result)
	if err != nil {
		return MongoBird{}, err
	}
	return result, nil
}

func (h *MongoDBHandler) Create(w http.ResponseWriter, r *http.Request) {
	// defer r.Body.Close()

	// var data map[string]CreateRecord
	// if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
	// 	http.Error(w, fmt.Sprintf("Failed to decode request body: %v", err), http.StatusBadRequest)
	// }

	const maxMemory = 10 << 20 // 10 MB
	err := r.ParseMultipartForm(maxMemory)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to parse form: %v", err), http.StatusBadRequest)
		return
	}

	category := r.FormValue("category")
	commonName := r.FormValue("common_name")
	observedDate := r.FormValue("observed_date")
	scientificName := r.FormValue("scientific_name")
	natureGroup := r.FormValue("nature_group")
	image := r.FormValue("image")

	fmt.Println("Category:", category)
	fmt.Println("Common Name:", commonName)
	fmt.Println("Observed Date:", observedDate)
	fmt.Println("Scientific Name:", scientificName)
	fmt.Println("Nature Group:", natureGroup)
	fmt.Println("Image:", image)

	// response := struct{}{
	// 	Status:  "success",
	// 	Message: "Record created successfully",
	// }

	response := struct {
		Status  string
		Message string
	}{
		Status:  "Success",
		Message: "Record created successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, fmt.Sprintf("Error encoding response: %v", err), http.StatusInternalServerError)
	}
}
