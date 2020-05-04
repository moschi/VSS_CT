package jassmodels

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// CreateRound ...
func CreateRound(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	vars := mux.Vars(r)
	gameID, _ := strconv.Atoi(vars["gameId"])

	var round Round
	json.NewDecoder(r.Body).Decode(&round)

	var roundID int32
	database.QueryRow("INSERT INTO round(game, trumpf) VALUES($1, $2) RETURNING id;", gameID, &round.TrumpfID).Scan(&roundID)

	log.Println(&round.PointsPerTeamPerRound[0].Points)

	for _, perTeam := range round.PointsPerTeamPerRound {
		err := database.QueryRow("INSERT INTO pointsperteamperround (wiispoints, points, round, team) VALUES($1, $2, $3, $4)", perTeam.WiisPoints, perTeam.Points, roundID, perTeam.TeamID)

		if err != nil {
			log.Println(err)
		}
	}
	json.NewEncoder(w).Encode(InlineResponse201{roundID})
	w.WriteHeader(http.StatusOK)
}

// DeleteRound ...
func DeleteRound(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	vars := mux.Vars(r)
	gameID, _ := strconv.Atoi(vars["gameId"])
	roundID, _ := strconv.Atoi(vars["roundId"])

	database.Exec("DELETE FROM pointsPerTeamPerRound where round = $1;", roundID)
	database.Exec("DELETE FROM round WHERE id = $1 AND game = $2;", roundID, gameID)

	w.WriteHeader(http.StatusOK)
}

// UpdateRound ...
func UpdateRound(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	vars := mux.Vars(r)
	gameID, _ := strconv.Atoi(vars["gameId"])
	roundID, _ := strconv.Atoi(vars["roundId"])

	var round Round
	json.NewDecoder(r.Body).Decode(&round)

	database.Exec("UPDATE round SET trumpf = $1 WHERE id = $2 and game = $3", &round.TrumpfID, roundID, gameID)

	for _, perTeam := range round.PointsPerTeamPerRound {
		database.Exec("UPDATE pointsperteamperround SET wiispoints = $1, points = $2, round = $3, team = $4) WHERE round = $5 and team = $6", perTeam.WiisPoints, perTeam.Points, roundID, perTeam.TeamID, roundID, perTeam.TeamID)
	}

	w.WriteHeader(http.StatusOK)
}
