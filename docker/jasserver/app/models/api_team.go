package jassmodels

import (
	"encoding/json"
	"net/http"

	"github.com/jmoiron/sqlx"
)

// CreateTeam ...
func CreateTeam(w http.ResponseWriter, r *http.Request) {
	var team Team
	HandleBadRequest(w, json.NewDecoder(r.Body).Decode(&team))

	if teamExists(team.Name, database) {
		w.WriteHeader(http.StatusUnprocessableEntity)
		http.Error(w, "Name already in use", http.StatusUnprocessableEntity)

		return
	}

	userID, databaseErr := getUserIDFromRequest(r)
	HandleDbError(w, databaseErr)

	var id int32
	HandleDbError(w, database.QueryRow("INSERT INTO team (name, createdby) VALUES ($1, $2) RETURNING id", team.Name, userID).Scan(&id))

	json.NewEncoder(w).Encode(InlineResponse201{id})
	w.WriteHeader(http.StatusOK)
}

func teamExists(name string, db *sqlx.DB) bool {
	var count int32
	database.QueryRow("SELECT COUNT(*) FROM team WHERE name = $1", name).Scan(&count)

	return count > 0
}

// GetTeam ...
func GetTeam(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	userID, databaseErr := getUserIDFromRequest(r)
	HandleDbError(w, databaseErr)

	teams := []Team{}
	HandleDbError(w, database.Select(&teams, "SELECT * FROM team WHERE createdby = $1", userID))

	json.NewEncoder(w).Encode(teams)
}

// UpdateTeam ...
func UpdateTeam(w http.ResponseWriter, r *http.Request) {
	var team Team
	HandleBadRequest(w, json.NewDecoder(r.Body).Decode(&team))

	if team.ID == 0 || team.Name == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	_, databaseErr := database.Exec("UPDATE team SET name=$1 WHERE ID=$2", team.Name, team.ID)
	HandleDbError(w, databaseErr)

	w.WriteHeader(http.StatusOK)
}
