package jassmodels

import (
	"fmt"

	"github.com/jmoiron/sqlx"
)

// Game ...
type Game struct {
	ID         int64   `json:"id"`
	IsFinished bool    `json:"isFinished"`
	Team1      int32   `json:"-"`
	Team2      int32   `json:"-"`
	CreatedBy  int32   `json:"-"`
	Teams      [2]Team `json:"teams"`
}

func loadGame(id int, db *sqlx.DB) Game {
	sqlStatement := "SELECT * FROM game WHERE id = $1"
	var game Game

	err := db.Get(&game, sqlStatement, id)
	if err != nil {
		fmt.Println(err)
	}

	game.Teams = [2]Team{}

	return game
}
