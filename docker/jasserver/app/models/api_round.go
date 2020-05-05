package jassmodels

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

// CreateRound ...
func CreateRound(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	vars := mux.Vars(r)
	gameID, convErr := strconv.Atoi(vars["gameId"])
	if HandleBadRequest(w, convErr) {
		return
	}

	var round Round
	decodeErr := json.NewDecoder(r.Body).Decode(&round)
	if HandleBadRequest(w, decodeErr) {
		return
	}

	var roundID int32
	databaseErr := database.QueryRow("INSERT INTO round(game, trumpf) VALUES($1, $2) RETURNING id;", gameID, &round.TrumpfID).Scan(&roundID)
	if HandleDbError(w, databaseErr) {
		return
	}

	tx, databaseErr := database.Begin()
	if HandleDbError(w, databaseErr) {
		return
	}

	for _, perTeam := range round.PointsPerTeamPerRound {
		_, databaseErr = tx.Exec("INSERT INTO pointsperteamperround (wiispoints, points, round, team) VALUES($1, $2, $3, $4)", perTeam.WiisPoints, perTeam.Points, roundID, perTeam.TeamID)
		if HandleTxDbError(w, tx, databaseErr) {
			return
		}
	}

	databaseErr = tx.Commit()
	if HandleTxDbError(w, tx, databaseErr) {
		return
	}

	json.NewEncoder(w).Encode(InlineResponse201{roundID})
	w.WriteHeader(http.StatusOK)
}

// DeleteRound ...
func DeleteRound(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	vars := mux.Vars(r)
	gameID, convErr := strconv.Atoi(vars["gameId"])
	if HandleBadRequest(w, convErr) {
		return
	}

	roundID, convErr := strconv.Atoi(vars["roundId"])
	if HandleBadRequest(w, convErr) {
		return
	}

	tx, databaseErr := database.Begin()
	if HandleDbError(w, databaseErr) {
		return
	}

	_, databaseErr = tx.Exec("DELETE FROM pointsPerTeamPerRound where round = $1;", roundID)
	if HandleTxDbError(w, tx, databaseErr) {
		return
	}

	_, databaseErr = database.Exec("DELETE FROM round WHERE id = $1 AND game = $2;", roundID, gameID)
	if HandleTxDbError(w, tx, databaseErr) {
		return
	}

	databaseErr = tx.Commit()
	if HandleTxDbError(w, tx, databaseErr) {
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// UpdateRound ...
func UpdateRound(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	vars := mux.Vars(r)
	gameID, convErr := strconv.Atoi(vars["gameId"])
	if HandleBadRequest(w, convErr) {
		return
	}

	roundID, convErr := strconv.Atoi(vars["roundId"])
	if HandleBadRequest(w, convErr) {
		return
	}

	var round Round
	decodeErr := json.NewDecoder(r.Body).Decode(&round)
	if HandleBadRequest(w, decodeErr) {
		return
	}

	userID, databaseErr := getUserIDFromRequest(r)
	if HandleDbError(w, databaseErr) {
		return
	}

	exists, databaseErr := roundExists(roundID, gameID, userID, database)
	if !exists {
		w.WriteHeader(http.StatusNotFound)
	}
	if HandleDbError(w, databaseErr) {
		return
	}

	tx, databaseErr := database.Begin()
	if HandleDbError(w, databaseErr) {
		return
	}

	_, databaseErr = tx.Exec("UPDATE round SET trumpf = $1 WHERE id = $2 and game = $3", &round.TrumpfID, roundID, gameID)
	if HandleTxDbError(w, tx, databaseErr) {
		return
	}

	for _, perTeam := range round.PointsPerTeamPerRound {
		_, databaseErr = tx.Exec("UPDATE pointsperteamperround SET wiispoints = $1, points = $2, round = $3, team = $4) WHERE round = $5 and team = $6", perTeam.WiisPoints, perTeam.Points, roundID, perTeam.TeamID, roundID, perTeam.TeamID)
		if HandleTxDbError(w, tx, databaseErr) {
			return
		}
	}

	databaseErr = tx.Commit()
	if HandleTxDbError(w, tx, databaseErr) {
		return
	}

	w.WriteHeader(http.StatusOK)
}

func roundExists(roundID int, gameID int, userID int, db *sqlx.DB) (bool, error) {
	var count int
	databaseErr := db.QueryRow("SELECT COUNT(*) FROM round LEFT JOIN game ON game.ID = round.game WHERE game.ID = $1 AND game.createdby = $2 AND round.ID = $3", gameID, userID, roundID).Scan(&count)

	return count > 0, databaseErr
}
