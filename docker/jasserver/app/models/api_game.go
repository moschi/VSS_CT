package jassmodels

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

// CreateGame ...
func CreateGame(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	var game Game
	HandleBadRequest(w, json.NewDecoder(r.Body).Decode(&game))

	userID, databaseErr := getUserIDFromRequest(r)
	HandleDbError(w, databaseErr)

	var gameID int32
	databaseErr = database.QueryRow("INSERT INTO game (team1, team2, isfinished, createdby) VALUES($1, $2, false, $3) RETURNING id", &game.Teams[0].ID, &game.Teams[1].ID, userID).Scan(&gameID)
	HandleDbError(w, databaseErr)

	json.NewEncoder(w).Encode(InlineResponse201{gameID})
	w.WriteHeader(http.StatusOK)
}

// DeleteGame ...
func DeleteGame(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	vars := mux.Vars(r)
	gameID, convErr := strconv.Atoi(vars["gameId"])
	HandleBadRequest(w, convErr)

	userID, databaseErr := getUserIDFromRequest(r)
	HandleDbError(w, databaseErr)

	if !gameExists(gameID, userID, database) {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	tx, databaseErr := database.Begin()
	HandleDbError(w, databaseErr)

	_, databaseErr = tx.Exec("DELETE FROM pointsperteamperround WHERE round IN(SELECT id FROM round WHERE game = $1)", gameID)
	HandleTxDbError(w, tx, databaseErr)

	_, databaseErr = tx.Exec("DELETE FROM round WHERE game = $1", gameID)
	HandleTxDbError(w, tx, databaseErr)

	_, databaseErr = tx.Exec("DELETE FROM game WHERE id = $1;", gameID)
	HandleTxDbError(w, tx, databaseErr)

	databaseErr = tx.Commit()
	HandleTxDbError(w, tx, databaseErr)

	w.WriteHeader(http.StatusOK)
}

// GetGame ...
func GetGame(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	userID, databaseErr := getUserIDFromRequest(r)
	HandleDbError(w, databaseErr)

	games := []Game{}
	databaseErr = database.Select(&games, "SELECT * FROM game WHERE createdby = $1", userID)
	HandleDbError(w, databaseErr)

	for i := range games {
		team1, databaseErr := loadTeam(games[i].Team1, database)
		HandleDbError(w, databaseErr)

		team2, databaseErr := loadTeam(games[i].Team2, database)
		HandleDbError(w, databaseErr)

		games[i].Teams = [2]Team{team1, team2}
	}

	json.NewEncoder(w).Encode(games)
	w.WriteHeader(http.StatusOK)
}

// GetgameByID ...
func GetgameByID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	vars := mux.Vars(r)
	gameID, convErr := strconv.Atoi(vars["gameId"])
	HandleBadRequest(w, convErr)

	userID, databaseErr := getUserIDFromRequest(r)
	HandleDbError(w, databaseErr)

	if !gameExists(gameID, userID, database) {
		http.Error(w, "Not Found", http.StatusNotFound)
		return
	}

	var fullGame FullGame
	game, databaseErr := loadGame(gameID, database)
	HandleDbError(w, databaseErr)

	fullGame.ID = game.ID
	fullGame.IsFinished = game.IsFinished
	team1, databaseErr := loadTeam(game.Team1, database)
	HandleDbError(w, databaseErr)

	team2, databaseErr := loadTeam(game.Team2, database)
	HandleDbError(w, databaseErr)

	fullGame.Teams = []Team{team1, team2}

	rounds, databaseErr := loadRounds(gameID, database)
	HandleDbError(w, databaseErr)
	fullGame.Rounds = rounds

	json.NewEncoder(w).Encode(fullGame)
	w.WriteHeader(http.StatusOK)
}

func gameExists(id int, userID int, db *sqlx.DB) bool {
	var count int32
	database.QueryRow("SELECT COUNT(*) FROM game WHERE id = $1 and createdby = $2", id, userID).Scan(&count)

	return count > 0
}
