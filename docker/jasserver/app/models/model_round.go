package jassmodels

import (
	"fmt"

	"github.com/jmoiron/sqlx"
)

// Round ...
type Round struct {
	ID                    int64                   `json:"id,omitempty"`
	TrumpfID              int64                   `json:"trumpfId,omitempty" db:"trumpf"`
	PointsPerTeamPerRound []PointsPerTeamPerRound `json:"pointsPerTeamPerRound,omitempty"`
	Game                  int64                   `json:"-"`
}

func loadRound(id int64, db *sqlx.DB) Round {
	sqlStatement := "SELECT * FROM round WHERE id = $1"
	var round Round

	err := db.Get(&round, sqlStatement, id)
	if err != nil {
		fmt.Println(err)
	}
	return round
}

func loadRounds(gameID int, db *sqlx.DB) []Round {
	sqlStatement := "SELECT * FROM round WHERE game = $1"

	rounds := make([]Round, 0)

	err := db.Select(&rounds, sqlStatement, gameID)
	if err != nil {
		fmt.Println(err)
	}

	for i := range rounds {
		rounds[i].PointsPerTeamPerRound = loadPointsPerRound(rounds[i].ID, db)
	}

	return rounds
}
