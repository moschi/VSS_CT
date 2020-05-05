package jassmodels

import (
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

func loadPointsPerTeamPerRound(teamID int, roundID int64, db *sqlx.DB) (PointsPerTeamPerRound, error) {
	sqlStatement := "SELECT * FROM pointsPerTeamPerRound WHERE teamID = $1 AND round = $2"
	var pointsPerTeamPerRound PointsPerTeamPerRound

	databaseErr := db.Get(&pointsPerTeamPerRound, sqlStatement, teamID, roundID)
	return pointsPerTeamPerRound, databaseErr
}

func loadPointsPerRound(roundID int64, db *sqlx.DB) ([]PointsPerTeamPerRound, error) {
	sqlStatement := "SELECT * FROM pointsPerTeamPerRound WHERE round = $1"
	pointsPerTeamPerRound := make([]PointsPerTeamPerRound, 0)

	databaseErr := db.Select(&pointsPerTeamPerRound, sqlStatement, roundID)
	return pointsPerTeamPerRound, databaseErr
}
