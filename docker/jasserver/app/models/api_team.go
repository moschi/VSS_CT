package jassmodels

import (
	"net/http"
	"encoding/json"
	"log"
)

// CreateTeam ...
func CreateTeam(w http.ResponseWriter, r *http.Request) {
    var team Team
    err := json.NewDecoder(r.Body).Decode(&team)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
    	w.WriteHeader(http.StatusInternalServerError)
    	return
    }
    log.Println(team)
    var id int32
    // TODO createdby should be the calling user
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
	teams := []Team{}
    database.Select(&teams, "SELECT * FROM team WHERE createdby = 0")
    log.Println(teams)
    json.NewEncoder(w).Encode(teams)
}

// UpdateTeam ...
func UpdateTeam(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)
}
