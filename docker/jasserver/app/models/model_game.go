package jassmodels

import (
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

func loadGame(id int, db *sqlx.DB) (Game, error) {
	sqlStatement := "SELECT * FROM game WHERE id = $1"
	var game Game

	databaseErr := db.Get(&game, sqlStatement, id)
	game.Teams = [2]Team{}

	return game, databaseErr
}
