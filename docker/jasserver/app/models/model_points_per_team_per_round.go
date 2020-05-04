package jassmodels

import (
	"fmt"

	"github.com/jmoiron/sqlx"
)

// PointsPerTeamPerRound ...
type PointsPerTeamPerRound struct {
	WiisPoints int64 `json:"wiisPoints"`
	Points     int64 `json:"points"`
	TeamID     int64 `json:"teamId" db:"team"`
	Round      int64 `json:"-"`
	ID         int64 `json:"-"`
}

func loadPointsPerTeamPerRound(teamID int, roundID int64, db *sqlx.DB) PointsPerTeamPerRound {
	sqlStatement := "SELECT * FROM pointsPerTeamPerRound WHERE teamID = $1 AND round = $2"
	var pointsPerTeamPerRound PointsPerTeamPerRound

	err := db.Get(&pointsPerTeamPerRound, sqlStatement, teamID, roundID)
	if err != nil {
		fmt.Println(err)
	}

	return pointsPerTeamPerRound
}

func loadPointsPerRound(roundID int64, db *sqlx.DB) []PointsPerTeamPerRound {
	sqlStatement := "SELECT * FROM pointsPerTeamPerRound WHERE round = $1"
	var pointsPerTeamPerRound []PointsPerTeamPerRound

	err := db.Select(&pointsPerTeamPerRound, sqlStatement, roundID)
	if err != nil {
		fmt.Println(err)
	}

	return pointsPerTeamPerRound
}
