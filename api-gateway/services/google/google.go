package google

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	g "github.com/serpapi/google-search-results-golang"
)

type GoogleImage struct {
	Url string
}

func GetImages(w http.ResponseWriter, r *http.Request) {
	name := chi.URLParam(r, "name")
	parameter := map[string]string{
		"q":      name,
		"engine": "google_images",
		"ijn":    "0",
	}

	search := g.NewGoogleSearch(parameter, os.Getenv("SERP_API_KEY"))
	results, err := search.GetJSON()
	if err != nil {
		http.Error(w, fmt.Sprintf("Error fetching images: %v", err), http.StatusInternalServerError)
		return
	}
	images_results, ok := results["images_results"].([]interface{})
	if !ok || len(images_results) == 0 {
		http.Error(w, fmt.Sprintf("No images found for %v", name), http.StatusNotFound)
		return
	}

	var urls []string
	count := 0

	for _, image := range images_results {
		if count >= 4 {
			break
		}

		imageMap, ok := image.(map[string]interface{})
		if !ok {
			continue
		}

		originalURL, ok := imageMap["original"].(string)
		if !ok {
			continue
		}

		urls = append(urls, originalURL)
		count++
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(urls)
}
