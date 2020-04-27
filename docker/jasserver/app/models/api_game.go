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

	var gameID int32
	err := database.QueryRow("INSERT INTO game (team1, team2, isfinished, createdby) VALUES($1, $2, false, $3) RETURNING id", &game.Teams[0].ID, &game.Teams[1].ID, getUserIDFromRequest(r)).Scan(&gameID)
	if err != nil {
		log.Fatal(err)
	}

	log.Println(gameID)

	json.NewEncoder(w).Encode(InlineResponse201{gameID})
	w.WriteHeader(http.StatusOK)
}

// DeleteGame ...
func DeleteGame(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	vars := mux.Vars(r)
	gameID, _ := strconv.Atoi(vars["gameId"])

	database.Exec("DELETE FROM pointsperteamperround WHERE round IN(SELECT id FROM round WHERE game = $1)", gameID)
	database.Exec("DELETE FROM round WHERE game = $1", gameID)
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
	database.Select(&games, "SELECT * FROM game WHERE createdby = $1", getUserIDFromRequest(r))

	for i := range games {
		games[i].Teams = [2]Team{
			loadTeam(games[i].Team1, database),
			loadTeam(games[i].Team2, database),
		}
	}

	json.NewEncoder(w).Encode(games)
	w.WriteHeader(http.StatusOK)
}

// GetgameById ...
func GetgameById(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	vars := mux.Vars(r)
	gameID, _ := strconv.Atoi(vars["gameId"])

	var fullGame FullGame
	game := loadGame(gameID, database)

	fullGame.ID = game.ID
	fullGame.IsFinished = game.IsFinished
	fullGame.Teams = []Team{
		loadTeam(game.Team1, database),
		loadTeam(game.Team2, database),
	}

	var rounds = loadRounds(gameID, database)
	fullGame.Rounds = rounds

	json.NewEncoder(w).Encode(fullGame)
	w.WriteHeader(http.StatusOK)
}
