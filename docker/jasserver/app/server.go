package main

import (
	"log"
	"net/http"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"

	jassmodels "jasserver/app/models" // used in docker
	//jassmodels "./models"
)

const DEBUG bool = false // Switch between DEBUG and PRODUCTION: if true, host and port will be overwritten!

var host string = "postgres"
var port string = ":8080"
var dbport string = "5432"

const db string = "jass"

func init() {
	if DEBUG {
		host = "localhost"
		port = ":9090"
		dbport = "5433"
	}
}

func main() {
	log.Println(host)
	log.Println(port)
	log.Printf("Server started")
	connStr := "user=postgres dbname=jass sslmode=disable password=postgres host=" + host + " port=" + dbport + ""
	db, databaseErr := sqlx.Open("postgres", connStr)

	if databaseErr != nil {
		log.Fatal(databaseErr)
	}

	router := jassmodels.NewRouter(db)

	// use port 9090 for local debugging (since its hopefully free) and 8080 for using in docker
	log.Fatal(http.ListenAndServe(port, router))
	if err := http.ListenAndServe(port, nil); err != nil {
		panic(err)
	}
}
