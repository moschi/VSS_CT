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
	HandleBadRequest(w, convErr)

	var round Round
	HandleBadRequest(w, json.NewDecoder(r.Body).Decode(&round))

	var roundID int32
	HandleDbError(w, database.QueryRow("INSERT INTO round(game, trumpf) VALUES($1, $2) RETURNING id;", gameID, &round.TrumpfID).Scan(&roundID))

	tx, databaseErr := database.Begin()
	HandleDbError(w, databaseErr)

	for _, perTeam := range round.PointsPerTeamPerRound {
		_, databaseErr = tx.Exec("INSERT INTO pointsperteamperround (wiispoints, points, round, team) VALUES($1, $2, $3, $4)", perTeam.WiisPoints, perTeam.Points, roundID, perTeam.TeamID)
		HandleTxDbError(w, tx, databaseErr)
	}

	HandleTxDbError(w, tx, tx.Commit())

	json.NewEncoder(w).Encode(InlineResponse201{roundID})
	w.WriteHeader(http.StatusOK)
}

// DeleteRound ...
func DeleteRound(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	vars := mux.Vars(r)
	gameID, convErr := strconv.Atoi(vars["gameId"])
	HandleBadRequest(w, convErr)

	roundID, convErr := strconv.Atoi(vars["roundId"])
	HandleBadRequest(w, convErr)

	tx, databaseErr := database.Begin()
	HandleDbError(w, databaseErr)

	_, databaseErr = tx.Exec("DELETE FROM pointsPerTeamPerRound where round = $1;", roundID)
	HandleTxDbError(w, tx, databaseErr)

	_, databaseErr = database.Exec("DELETE FROM round WHERE id = $1 AND game = $2;", roundID, gameID)
	HandleTxDbError(w, tx, databaseErr)

	HandleTxDbError(w, tx, tx.Commit())
	w.WriteHeader(http.StatusNoContent)
}

// UpdateRound ...
func UpdateRound(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	vars := mux.Vars(r)
	gameID, convErr := strconv.Atoi(vars["gameId"])
	HandleBadRequest(w, convErr)

	roundID, convErr := strconv.Atoi(vars["roundId"])
	HandleBadRequest(w, convErr)

	var round Round
	HandleBadRequest(w, json.NewDecoder(r.Body).Decode(&round))

	userID, databaseErr := getUserIDFromRequest(r)
	HandleDbError(w, databaseErr)

	exists, databaseErr := roundExists(roundID, gameID, userID, database)
	if !exists {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	HandleDbError(w, databaseErr)

	tx, databaseErr := database.Begin()
	HandleDbError(w, databaseErr)

	_, databaseErr = tx.Exec("UPDATE round SET trumpf = $1 WHERE id = $2 and game = $3", &round.TrumpfID, roundID, gameID)
	HandleTxDbError(w, tx, databaseErr)

	for _, perTeam := range round.PointsPerTeamPerRound {
		_, databaseErr = tx.Exec("UPDATE pointsperteamperround SET wiispoints = $1, points = $2, round = $3, team = $4) WHERE round = $5 and team = $6", perTeam.WiisPoints, perTeam.Points, roundID, perTeam.TeamID, roundID, perTeam.TeamID)
		HandleTxDbError(w, tx, databaseErr)
	}

	HandleTxDbError(w, tx, tx.Commit())
	w.WriteHeader(http.StatusOK)
}

func roundExists(roundID int, gameID int, userID int, db *sqlx.DB) (bool, error) {
	var count int
	databaseErr := db.QueryRow("SELECT COUNT(*) FROM round LEFT JOIN game ON game.ID = round.game WHERE game.ID = $1 AND game.createdby = $2 AND round.ID = $3", gameID, userID, roundID).Scan(&count)

	return count > 0, databaseErr
}
