package jassmodels

//import "database/sql"
import (
	//"github.com/jmoiron/sqlx"

	"fmt"

	"github.com/jmoiron/sqlx"
)

// Trumpf ...
type Trumpf struct {
	ID         int64  `json:"id"`
	Name       string `json:"name"`
	Multiplier int32  `json:"multiplier"`
}

func loadTrumpf(id int, db *sqlx.DB) Trumpf {
	sqlStatement := "SELECT * FROM trumpf WHERE id = $1"
	var trumpf Trumpf

	err := db.Get(&trumpf, sqlStatement, id)
	if err != nil {
		fmt.Println(err)
	}
	return trumpf
}
