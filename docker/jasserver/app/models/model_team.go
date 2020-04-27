package jassmodels

import (
	"fmt"

	"github.com/jmoiron/sqlx"
)

// Team ...
type Team struct {
	ID        int64  `json:"id,omitempty"`
	Name      string `json:"name,omitempty"`
	CreatedBy int64  `json:"-"`
}

func loadTeam(id int32, db *sqlx.DB) Team {
	sqlStatement := "SELECT * FROM team WHERE id = $1"
	var team Team

	err := db.Get(&team, sqlStatement, id)
	if err != nil {
		fmt.Println(err)
	}
	return team
}
