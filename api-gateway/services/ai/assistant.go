package ai

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type InputData struct {
	Collection string            `json:"collection"`
	Item       string            `json:"item"`
	DBData     map[string]string `json:"db_data"`
	Context    string            `json:"context"`
}

func GetAssistant(data InputData) (string, error) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return "", fmt.Errorf("failed to marshal input data: %v", err)
	}

	req, err := http.NewRequest("POST", os.Getenv("AI_SERVER_URL")+"/ai/generate", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to send request: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response body: %v", err)
	}
	return string(body), nil
}
