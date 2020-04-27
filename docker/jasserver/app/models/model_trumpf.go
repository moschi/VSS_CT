package jassmodels

//import "database/sql"
import (
	//"github.com/jmoiron/sqlx"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/jmoiron/sqlx"
)

// Trumpf ...
type Trumpf struct {
	ID         int64  `json:"id,omitempty"`
	Name       string `json:"name,omitempty"`
	Multiplier int32  `json:"multiplier,omitempty"`
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

// GetTrumpf ...
func GetTrumpf(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	b, _ := json.Marshal(loadTrumpf(2, database))
	log.Println(string(b))
	w.Write([]byte(string(b)))
	w.WriteHeader(http.StatusOK)
}

// type Trumpfs []Trumpf

// func GetTrumpfs() Trumpfs {
// 	return TheTrumpfs
// }

// var TheTrumpfs = Trumpfs{
// 	Trumpf{
// 		1,
// 		"Rosen",
// 		1,
// 	},

// 	Trumpf{
// 		2,
// 		"Eicheln",
// 		1,
// 	},

// 	Trumpf{
// 		3,
// 		"Schellen",
// 		2,
// 	},

// 	Trumpf{
// 		4,
// 		"Schilten",
// 		2,
// 	},

// 	Trumpf{
// 		5,
// 		"Oben-Aben",
// 		3,
// 	},

// 	Trumpf{
// 		6,
// 		"Unten-Ufen",
// 		3,
// 	},
// }
