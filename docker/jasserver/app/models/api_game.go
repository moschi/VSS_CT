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

	decodeErr := json.NewDecoder(r.Body).Decode(&game)

	if HandleBadRequest(w, decodeErr) {
		return
	}

	userID, databaseErr := getUserIDFromRequest(r)
	if HandleDbError(w, databaseErr) {
		return
	}

	var gameID int32
	databaseErr = database.QueryRow("INSERT INTO game (team1, team2, isfinished, createdby) VALUES($1, $2, false, $3) RETURNING id", &game.Teams[0].ID, &game.Teams[1].ID, userID).Scan(&gameID)
	if HandleDbError(w, databaseErr) {
		return
	}

	json.NewEncoder(w).Encode(InlineResponse201{gameID})
	w.WriteHeader(http.StatusOK)
}

// DeleteGame ...
func DeleteGame(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	vars := mux.Vars(r)
	gameID, convErr := strconv.Atoi(vars["gameId"])
	if HandleBadRequest(w, convErr) {
		return
	}

	userID, databaseErr := getUserIDFromRequest(r)
	if HandleDbError(w, databaseErr) {
		return
	}

	if !gameExists(gameID, userID, database) {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	tx, databaseErr := database.Begin()
	if HandleDbError(w, databaseErr) {
		return
	}

	_, databaseErr = tx.Exec("DELETE FROM pointsperteamperround WHERE round IN(SELECT id FROM round WHERE game = $1)", gameID)
	if HandleTxDbError(w, tx, databaseErr) {
		return
	}

	_, databaseErr = tx.Exec("DELETE FROM round WHERE game = $1", gameID)
	if HandleTxDbError(w, tx, databaseErr) {
		return
	}

	_, databaseErr = tx.Exec("DELETE FROM game WHERE id = $1;", gameID)
	if HandleTxDbError(w, tx, databaseErr) {
		return
	}

	databaseErr = tx.Commit()
	if HandleTxDbError(w, tx, databaseErr) {
		return
	}

	w.WriteHeader(http.StatusOK)
}

// GetGame ...
func GetGame(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	userID, databaseErr := getUserIDFromRequest(r)
	if HandleDbError(w, databaseErr) {
		return
	}

	games := []Game{}
	databaseErr = database.Select(&games, "SELECT * FROM game WHERE createdby = $1", userID)
	if HandleDbError(w, databaseErr) {
		return
	}

	for i := range games {
		team1, databaseErr := loadTeam(games[i].Team1, database)
		if HandleDbError(w, databaseErr) {
			return
		}
		team2, databaseErr := loadTeam(games[i].Team2, database)
		if HandleDbError(w, databaseErr) {
			return
		}
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
	if HandleBadRequest(w, convErr) {
		return
	}

	userID, databaseErr := getUserIDFromRequest(r)
	if HandleDbError(w, databaseErr) {
		return
	}

	if !gameExists(gameID, userID, database) {
		http.Error(w, "Not Found", http.StatusNotFound)
		return
	}

	var fullGame FullGame
	game, databaseErr := loadGame(gameID, database)
	if HandleDbError(w, databaseErr) {
		return
	}

	fullGame.ID = game.ID
	fullGame.IsFinished = game.IsFinished
	team1, databaseErr := loadTeam(game.Team1, database)
	if HandleDbError(w, databaseErr) {
		return
	}

	team2, databaseErr := loadTeam(game.Team2, database)
	if HandleDbError(w, databaseErr) {
		return
	}

	fullGame.Teams = []Team{team1, team2}

	rounds, databaseErr := loadRounds(gameID, database)
	if HandleDbError(w, databaseErr) {
		return
	}
	fullGame.Rounds = rounds

	json.NewEncoder(w).Encode(fullGame)
	w.WriteHeader(http.StatusOK)
}

func gameExists(id int, userID int, db *sqlx.DB) bool {
	var count int32
	database.QueryRow("SELECT COUNT(*) FROM game WHERE id = $1 and createdby = $2", id, userID).Scan(&count)

	return count > 0
}
