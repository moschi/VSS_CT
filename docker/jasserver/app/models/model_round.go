package jassmodels

import (
	"fmt"

	"github.com/jmoiron/sqlx"
)

// Round ...
type Round struct {
	ID                    int64                   `json:"id,omitempty"`
	TrumpfID              int64                   `json:"trumpfId,omitempty"`
	PointsPerTeamPerRound []PointsPerTeamPerRound `json:"pointsPerTeamPerRound,omitempty"`
}

func loadRound(id int, db *sqlx.DB) Round {
	sqlStatement := "SELECT * FROM round WHERE id = $1"
	var round Round

	err := db.Get(&round, sqlStatement, id)
	if err != nil {
		fmt.Println(err)
	}
	return round
}
