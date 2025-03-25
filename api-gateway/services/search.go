package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

type QueryParams struct {
	Query                    string   `json:"query"`
	Topic                    string   `json:"topic"`
	SearchDepth              string   `json:"search_depth"`
	ChunksPerSource          int      `json:"chunks_per_source"`
	MaxResults               int      `json:"max_results"`
	TimeRange                *string  `json:"time_range"` // Use a pointer to handle null values
	Days                     int      `json:"days"`
	IncludeAnswer            bool     `json:"include_answer"`
	IncludeRawContent        bool     `json:"include_raw_content"`
	IncludeImages            bool     `json:"include_images"`
	IncludeImageDescriptions bool     `json:"include_image_descriptions"`
	IncludeDomains           []string `json:"include_domains"`
	ExcludeDomains           []string `json:"exclude_domains"`
}

func WebSearch(collection string, item string) (string, error) {
	url := "https://api.tavily.com/search"

	query := fmt.Sprintf("Information about %v %v", collection, item)
	queryParams := QueryParams{
		Query:                    query,
		Topic:                    "general",
		SearchDepth:              "basic",
		ChunksPerSource:          3,
		MaxResults:               5,
		TimeRange:                nil, // Use nil to represent null
		Days:                     3,
		IncludeAnswer:            true,
		IncludeRawContent:        false,
		IncludeImages:            false,
		IncludeImageDescriptions: false,
		IncludeDomains:           []string{},
		ExcludeDomains:           []string{},
	}

	jsonPayload, err := json.Marshal(queryParams)
	if err != nil {
		log.Fatal(err)
	}

	payload := bytes.NewBuffer(jsonPayload)
	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("Authorization", fmt.Sprintf("Bearer %v", os.Getenv("TAVILY_API_KEY")))
	req.Header.Add("Content-Type", "application/json")

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Fatal(err)
	}

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	return string(body), nil
}
