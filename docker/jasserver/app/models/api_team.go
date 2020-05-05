package jassmodels

import (
	"encoding/json"
	"net/http"

	"github.com/jmoiron/sqlx"
)

// CreateTeam ...
func CreateTeam(w http.ResponseWriter, r *http.Request) {
	var team Team
	decodeErr := json.NewDecoder(r.Body).Decode(&team)
	if HandleBadRequest(w, decodeErr) {
		return
	}

	if teamExists(team.Name, database) {
		w.WriteHeader(http.StatusUnprocessableEntity)
		http.Error(w, "Name already in use", http.StatusUnprocessableEntity)

		return
	}

	userID, databaseErr := getUserIDFromRequest(r)
	if HandleDbError(w, databaseErr) {
		return
	}

	var id int32
	databaseErr = database.QueryRow("INSERT INTO team (name, createdby) VALUES ($1, $2) RETURNING id", team.Name, userID).Scan(&id)
	if HandleDbError(w, databaseErr) {
		return
	}

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
	if HandleDbError(w, databaseErr) {
		return
	}

	teams := []Team{}
	databaseErr = database.Select(&teams, "SELECT * FROM team WHERE createdby = $1", userID)
	if HandleDbError(w, databaseErr) {
		return
	}

	json.NewEncoder(w).Encode(teams)
}

// UpdateTeam ...
func UpdateTeam(w http.ResponseWriter, r *http.Request) {
	var team Team
	decodeErr := json.NewDecoder(r.Body).Decode(&team)
	if HandleBadRequest(w, decodeErr) {
		return
	}

	if team.ID == 0 || team.Name == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	_, databaseErr := database.Exec("UPDATE team SET name=$1 WHERE ID=$2", team.Name, team.ID)
	if HandleDbError(w, databaseErr) {
		return
	}
	w.WriteHeader(http.StatusOK)
}
