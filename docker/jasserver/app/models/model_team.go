package jassmodels

import (
	"github.com/jmoiron/sqlx"
)

// Team ...
type Team struct {
	ID        int64  `json:"id"`
	Name      string `json:"name"`
	CreatedBy int64  `json:"-"`
}

func loadTeam(id int32, db *sqlx.DB) (Team, error) {
	var team Team
	databaseErr := db.Get(&team, "SELECT * FROM team WHERE id = $1", id)
	return team, databaseErr
}
