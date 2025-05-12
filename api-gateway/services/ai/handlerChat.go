package ai

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/sharukat/swanlake/utilities"
)

type HistoryItem struct {
	Text   string `json:"text"`
	Sender string `json:"sender"`
}

type Input struct {
	History []HistoryItem `json:"history"`
}

type ResponseStruct struct {
	Response []byte `json:"response"`
	Error    error  `json:"error"`
}

func ChatHandlerFunc(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Chat endpoint hit")
	ch := make(chan ResponseStruct)
	decoder := json.NewDecoder(r.Body)
	defer r.Body.Close()

	var data Input
	if err := decoder.Decode(&data); err != nil {
		fmt.Println("Error decoding request body:", err)
		http.Error(w, fmt.Sprintf("Error decoding request body: %v", err), http.StatusBadRequest)
		return
	}

	go func(ch chan<- ResponseStruct) {
		result, err := utilities.SendAPIRequest(
			"POST",
			os.Getenv("AI_SERVER_URL")+"/ai/chatbot",
			data)
		ch <- ResponseStruct{result, err}
	}(ch)

	response := <-ch
	if response.Error != nil {
		http.Error(w, fmt.Sprintf("Error: %v", response.Error), http.StatusInternalServerError)
		return
	}

	var responseStr string
	err := json.Unmarshal(response.Response, &responseStr)
	if err != nil {
		responseStr = strings.Trim(string(response.Response), "\"")
	}

	fmt.Println("Response from AI service:", string(response.Response))
	finalResponse := struct {
		Response string `json:"response"`
	}{
		Response: responseStr,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(finalResponse); err != nil {
		http.Error(w, fmt.Sprintf("Error encoding response: %v", err), http.StatusInternalServerError)
	}

}
