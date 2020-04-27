package jassmodels

import (
	"encoding/json"
	"net/http"
)

// CreateGame ...
func CreateGame(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	var game Game

	json.NewDecoder(r.Body).Decode(&game)

	tx := database.MustBegin()
	tx.MustExec("INSERT INTO game (team1, team2, isfinished, createdby) VALUES($1, $2, false, $3)", &game.Teams[0].ID, &game.Teams[1].ID, 0)
	tx.Commit()

	w.WriteHeader(http.StatusOK)
}

// DeleteGame ...
func DeleteGame(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	w.WriteHeader(http.StatusOK)
}

// GetGame ...
func GetGame(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)
}

// GetgameById ...
func GetgameById(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)
}
