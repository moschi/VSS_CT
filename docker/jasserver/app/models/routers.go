package jassmodels

import (
	"fmt"
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

// Routes ...
type Routes []Route

var database *sqlx.DB

// NewRouter ...
func NewRouter(db *sqlx.DB) *mux.Router {
	router := mux.NewRouter().StrictSlash(true)
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
		"GetTrumpf",
		strings.ToUpper("Get"),
		"/v1/trumpf",
		GetTrumpf,
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
		"DeleteTeam",
		strings.ToUpper("Delete"),
		"/v1/team",
		DeleteTeam,
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
}
