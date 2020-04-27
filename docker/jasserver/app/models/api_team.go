package jassmodels

import (
	"net/http"
	"encoding/json"
	"log"
	"strconv"
    "github.com/gorilla/mux"
)

// CreateTeam ...
func CreateTeam(w http.ResponseWriter, r *http.Request) {
    var team Team
    log.Println("Try to create: " + team)
    err := json.NewDecoder(r.Body).Decode(&team)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
    	w.WriteHeader(http.StatusInternalServerError)
    	return
    }
    var id int32
    databaseErr := database.QueryRow("INSERT INTO team (name, createdby) VALUES ($1, 0) RETURNING id", team.Name).Scan(&id)
    if databaseErr != nil {
    	log.Fatal(databaseErr)
    	w.WriteHeader(http.StatusInternalServerError)
    	return
    }
	json.NewEncoder(w).Encode(InlineResponse201{id})
	w.WriteHeader(http.StatusOK)
}

// GetTeam ...
func GetTeam(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)
}

// UpdateTeam ...
func UpdateTeam(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)
}
