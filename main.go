package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
	"github.com/rs/cors"
)

func main() {
	mux := http.NewServeMux()
	
	mux.HandleFunc("/time", func(w http.ResponseWriter, r *http.Request) {
		currentTime := time.Now()
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(struct {
			Time string `json:"time"`
		}{
			Time: currentTime.Format(time.RFC3339),
		})
	})

	mux.Handle("/", http.FileServer(http.Dir("./static")))

	handler := cors.Default().Handler(mux)

	log.Println("Starting server on :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}