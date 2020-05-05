package jassmodels

import (
	"github.com/jmoiron/sqlx"
)

// Round ...
type Round struct {
	ID                    int64                   `json:"id"`
	TrumpfID              int64                   `json:"trumpfId" db:"trumpf"`
	PointsPerTeamPerRound []PointsPerTeamPerRound `json:"pointsPerTeamPerRound"`
	Game                  int64                   `json:"-"`
}

func loadRound(id int64, db *sqlx.DB) (Round, error) {
	sqlStatement := "SELECT * FROM round WHERE id = $1"
	var round Round

	databaseErr := db.Get(&round, sqlStatement, id)
	return round, databaseErr
}

func loadRounds(gameID int, db *sqlx.DB) ([]Round, error) {
	sqlStatement := "SELECT * FROM round WHERE game = $1"

	rounds := make([]Round, 0)
	databaseErr := db.Select(&rounds, sqlStatement, gameID)
	for i := range rounds {
		rounds[i].PointsPerTeamPerRound, databaseErr = loadPointsPerRound(rounds[i].ID, db)
		if databaseErr != nil {
			break
		}
	}

	return rounds, databaseErr
}
