package jassmodels

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

// Route ...
type Route struct {
	Name        string
	Method      string
	Pattern     string
	HandlerFunc http.HandlerFunc
}

const DEBUG bool = false // Switch between DEBUG and PRODUCTION: if true, auth will not be checked

// catches routines that panic and returns from the function in order to make sure responses are sent to the webclient
type panicMiddleware struct{}

// our own routines panic if e.g. a request is formed badly or the database is suddenly unavaiable
func (panicCheck *panicMiddleware) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if r := recover(); r != nil {
				log.Println(r)
				return
			}
		}()
		next.ServeHTTP(w, r)
	})
}

// check if DB is running
type dbCheckMiddleware struct{}

func (dbcheck *dbCheckMiddleware) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if database.Ping() != nil {
			log.Println("Database system is unavailable")
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		} else {
			next.ServeHTTP(w, r)
		}
	})
}

// authMiddleware
type authenticationMiddleware struct{}

// Middleware function, which will be called for each request
func (amw *authenticationMiddleware) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token := r.Header.Get("X-WebAuth-User")

		userExists, databaseErr := userExists(token)

		if DEBUG {
			userExists = true
		}

		if databaseErr != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		}

		if userExists {
			log.Printf("Authenticated user %s\n", token)
			next.ServeHTTP(w, r)
		} else {
			http.Error(w, "Forbidden", http.StatusUnauthorized)
		}
	})
}

// HandleDbError ...
func HandleDbError(w http.ResponseWriter, err error) {
	if err != nil {
		log.Println(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		panic(err)
	}
}

// HandleTxDbError ...
func HandleTxDbError(w http.ResponseWriter, tx *sql.Tx, err error) {
	if err != nil {
		log.Println(err)
		tx.Rollback()
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		panic(err)
	}
}

// HandleBadRequest ...
func HandleBadRequest(w http.ResponseWriter, err error) {
	if err != nil {
		log.Println(err)
		http.Error(w, "Bad Request", http.StatusBadRequest)
		panic(err)
	}
}

func userExists(username string) (bool, error) {
	var count int
	databaseErr := database.QueryRow("SELECT COUNT(*) FROM jassuser WHERE name = $1", username).Scan(&count)

	return count == 1, databaseErr
}

func getUserID(username string) (int, error) {

	if DEBUG {
		return 0, nil
	}

	var userID int
	databaseErr := database.QueryRow("SELECT id FROM jassuser WHERE name = $1", username).Scan(&userID)
	return userID, databaseErr
}

func getUserIDFromRequest(r *http.Request) (int, error) {
	token := r.Header.Get("X-WebAuth-User")
	return getUserID(token)
}

// Routes ...
type Routes []Route

var database *sqlx.DB

// NewRouter ...
func NewRouter(db *sqlx.DB) *mux.Router {
	router := mux.NewRouter().StrictSlash(true)

	pnc := panicMiddleware{}
	router.Use(pnc.Middleware)

	dbc := dbCheckMiddleware{}
	router.Use(dbc.Middleware)

	amw := authenticationMiddleware{}
	router.Use(amw.Middleware)
	database = db
	for _, route := range routes {
		var handler http.Handler
		handler = route.HandlerFunc
		handler = Logger(handler, route.Name)

		router.
			Methods(route.Method).
			Path(route.Pattern).
			Name(route.Name).
			Handler(handler)
	}

	return router
}

// Index ...
func Index(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello World!")
}

var routes = Routes{
	Route{
		"Index",
		"GET",
		"/v1/",
		Index,
	},

	Route{
		"CreateGame",
		strings.ToUpper("Post"),
		"/v1/game",
		CreateGame,
	},

	Route{
		"DeleteGame",
		strings.ToUpper("Delete"),
		"/v1/game/{gameId}",
		DeleteGame,
	},

	Route{
		"GetGame",
		strings.ToUpper("Get"),
		"/v1/game",
		GetGame,
	},

	Route{
		"GetgameById",
		strings.ToUpper("Get"),
		"/v1/game/{gameId}",
		GetgameByID,
	},

	Route{
		"CreateRound",
		strings.ToUpper("Post"),
		"/v1/game/{gameId}/round",
		CreateRound,
	},

	Route{
		"DeleteRound",
		strings.ToUpper("Delete"),
		"/v1/game/{gameId}/{roundId}",
		DeleteRound,
	},

	Route{
		"UpdateRound",
		strings.ToUpper("Put"),
		"/v1/game/{gameId}/{roundId}",
		UpdateRound,
	},

	Route{
		"CreateTeam",
		strings.ToUpper("Post"),
		"/v1/team",
		CreateTeam,
	},

	Route{
		"GetTeam",
		strings.ToUpper("Get"),
		"/v1/team",
		GetTeam,
	},

	Route{
		"UpdateTeam",
		strings.ToUpper("Put"),
		"/v1/team",
		UpdateTeam,
	},

	Route{
		"GetTrumpfs",
		strings.ToUpper("Get"),
		"/v1/trumpf",
		GetTrumpfs,
	},
}
