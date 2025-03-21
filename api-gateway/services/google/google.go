package google

import (
	"fmt"
	"math"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/go-chi/chi/v5"
	g "github.com/serpapi/google-search-results-golang"
)

type GoogleImage struct {
	Url string
}

func GetImages(w http.ResponseWriter, r *http.Request) ([]string, error) {
	name := chi.URLParam(r, "name")
	parameter := map[string]string{
		"q":      name,
		"engine": "google_images",
		"ijn":    "0",
	}

	search := g.NewGoogleSearch(parameter, os.Getenv("SERP_API_KEY"))
	results, err := search.GetJSON()
	if err != nil {
		return nil, err
	}
	images_results, ok := results["images_results"].([]interface{})
	if !ok || len(images_results) == 0 {
		return nil, fmt.Errorf("no images found for %v", name)
	}

	var candidateURLs []string
	imageCount := 2
	for _, image := range images_results {
		imageMap, ok := image.(map[string]interface{})
		if !ok {
			continue
		}

		originalWidth, widthOk := imageMap["original_width"].(float64)
		originalHeight, heightOk := imageMap["original_height"].(float64)

		// Skip if width or height information is missing
		if !widthOk || !heightOk {
			continue
		}

		// Check if the image is square (or nearly square with 1-3px margin)
		widthHeightDiff := math.Abs(originalWidth - originalHeight)
		if widthHeightDiff <= 3 {
			originalURL, ok := imageMap["original"].(string)
			if !ok {
				continue
			}

			// Check if the URL uses HTTPS
			if strings.HasPrefix(originalURL, "https://") {
				candidateURLs = append(candidateURLs, originalURL)
			}
		}
	}

	// Process URLs concurrently using goroutines
	var (
		validURLs = make([]string, 0, imageCount)
		mutex     = &sync.Mutex{}
		wg        = &sync.WaitGroup{}
		client    = &http.Client{Timeout: 5 * time.Second}
		semaphore = make(chan struct{}, 10) // Limit concurrency to 10 requests at a time
	)

	for _, url := range candidateURLs {
		mutex.Lock()
		if len(validURLs) >= imageCount {
			mutex.Unlock()
			break
		}
		mutex.Unlock()

		wg.Add(1)
		semaphore <- struct{}{} // Acquire semaphore

		go func(url string) {
			defer wg.Done()
			defer func() { <-semaphore }() // Release semaphore

			// Check if URL returns 200 status code
			resp, err := client.Head(url)
			if err != nil || resp.StatusCode != http.StatusOK {
				return
			}

			// Close the response body
			if resp != nil && resp.Body != nil {
				resp.Body.Close()
			}

			// Add URL to valid URLs if we still need more
			mutex.Lock()
			if len(validURLs) < imageCount {
				validURLs = append(validURLs, url)
			}
			mutex.Unlock()
		}(url)
	}

	wg.Wait()
	return validURLs, nil
}
