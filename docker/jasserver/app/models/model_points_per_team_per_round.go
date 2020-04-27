package jassmodels

import (
	"fmt"

	"github.com/jmoiron/sqlx"
)

// PointsPerTeamPerRound ...
type PointsPerTeamPerRound struct {
	WiisPoints int64  `json:"wiisPoints,omitempty"`
	Points     int64  `json:"points,omitempty"`
	TeamID     int64  `json:"teamId,omitempty"`
	Round      *Round `json:"round,omitempty"`
}

func loadPointsPerTeamPerRound(teamID int, roundID int, db *sqlx.DB) PointsPerTeamPerRound {
	sqlStatement := "SELECT * FROM pointsPerTeamPerRound WHERE teamID = $1 AND roundID = $2"
	var pointsPerTeamPerRound PointsPerTeamPerRound

	err := db.Get(&pointsPerTeamPerRound, sqlStatement, teamID, roundID)
	if err != nil {
		fmt.Println(err)
	}

	*pointsPerTeamPerRound.Round = loadRound(roundID, db)

	return pointsPerTeamPerRound
}
