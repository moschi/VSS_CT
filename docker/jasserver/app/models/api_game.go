package jassmodels

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// CreateGame ...
func CreateGame(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	var game Game

	json.NewDecoder(r.Body).Decode(&game)

	var gameID int
	err := database.QueryRow("INSERT INTO game (team1, team2, isfinished, createdby) VALUES($1, $2, false, $3) RETURNING id", &game.Teams[0].ID, &game.Teams[1].ID, 0).Scan(&gameID)
	if err != nil {
		log.Fatal(err)
	}

	log.Println(gameID)

	w.WriteHeader(http.StatusOK)
}

// DeleteGame ...
func DeleteGame(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	vars := mux.Vars(r)
	gameID, _ := strconv.Atoi(vars["gameId"])

	_, err := database.Exec("DELETE FROM game WHERE id = $1;", gameID)

	if err != nil {
		panic(err)
	}

	w.WriteHeader(http.StatusOK)
}

// GetGame ...
func GetGame(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	games := []Game{}
	database.Select(&games, "SELECT * FROM game WHERE createdby = 0")

	b, _ := json.Marshal(games)

	log.Println(string(b))

	w.Write([]byte(string(b)))
	w.WriteHeader(http.StatusOK)
}

// GetgameById ...
func GetgameById(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	vars := mux.Vars(r)
	gameID, _ := strconv.Atoi(vars["gameId"])
	game := loadGame(gameID, database)
	b, _ := json.Marshal(game)

	w.Write([]byte(string(b)))
	w.WriteHeader(http.StatusOK)
}
