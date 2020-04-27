package jassmodels

import (
	"fmt"

	"github.com/jmoiron/sqlx"
)

// Game ...
type Game struct {
	ID         int64 `json:"id,omitempty"`
	IsFinished bool  `json:"isFinished,omitempty"`
	Team1      int32
	Team2      int32
	CreatedBy  int32
	Teams      []Team `json:"teams,omitempty"`
}

func loadGame(id int, db *sqlx.DB) Game {
	sqlStatement := "SELECT * FROM game WHERE id = $1"
	var game Game

	err := db.Get(&game, sqlStatement, id)
	if err != nil {
		fmt.Println(err)
	}

	game.Teams = []Team{}

	return game
}
