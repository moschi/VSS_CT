package jassmodels

import (
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

// authMiddleware
type authenticationMiddleware struct {
	tokenUsers map[string]string
}

// Middleware function, which will be called for each request
func (amw *authenticationMiddleware) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token := r.Header.Get("X-WebAuth-User")

		log.Println(token)

		if userExists(token) {
			// We found the token in our map
			log.Printf("Authenticated user %s\n", token)
			// Pass down the request to the next middleware (or final handler)
			next.ServeHTTP(w, r)
		} else {
			// Write an error and stop the handler chain
			http.Error(w, "Forbidden", http.StatusForbidden)
		}
	})
}

func userExists(username string) bool {
	var count int
	err := database.QueryRow("SELECT COUNT(*) FROM jassuser WHERE name = '" + username + "'").Scan(&count)

	if err != nil {
		log.Fatal(err)
	}

	return count == 1
}

func getUserID(username string) int {
	var userID int
	res := database.QueryRow("SELECT id FROM jassuser WHERE name = '" + username + "'")
	res.Scan(&userID)

	return userID
}

func getUserIDFromRequest(r *http.Request) int {
	token := r.Header.Get("X-WebAuth-User")
	return getUserID(token)
}

// Routes ...
type Routes []Route

var database *sqlx.DB

// NewRouter ...
func NewRouter(db *sqlx.DB) *mux.Router {
	router := mux.NewRouter().StrictSlash(true)
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
		GetgameById,
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
