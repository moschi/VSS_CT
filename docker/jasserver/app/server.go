package main

import (
	"database/sql"
	"log"
	"net/http"

	_ "github.com/lib/pq"
	//"github.com/lib/pq"
	//"database/sql"
	//"gopkg.in/mgo.v2/bson"
)

const DEBUG bool = false // Switch between DEBUG and PRODUCTION: if true, host and port will be overwritten!

var host string = "postgres"
var port string = ":8080"

const db string = "jass"

func init() {
	if DEBUG {
		host = "localhost"
		port = ":9090"
	}
}

func testDb() {
	connStr := "user=postgres dbname=jass sslmode=disable password=postgres host=postgres"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	result := db.QueryRow("SELECT COUNT(*) FROM user")
	var count int
	result.Scan(&count)
	log.Println(count)

	res, err := db.Exec("INSERT INTO user VALUES('moe')")
	if err != nil {
		log.Fatal(err)
	}
	log.Println(res)
	log.Println("Inserted value into DB")
}

func main() {
	log.Println(host)
	log.Println(port)
	testDb()
	// use port 9090 for local debugging (since its hopefully free) and 8080 for using in docker
	if err := http.ListenAndServe(port, nil); err != nil {
		panic(err)
	}
}
