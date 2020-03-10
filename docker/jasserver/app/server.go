package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"strings"

	graphql "github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/relay"
	"github.com/rs/cors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	//"gopkg.in/mgo.v2/bson"
)

func sayHello(w http.ResponseWriter, r *http.Request) {
	message := r.URL.Path
	message = strings.TrimPrefix(message, "/")
	name, err := os.Hostname()
	if err != nil {
		panic(err)
	}
	message = "Hello from " + name
	w.Write([]byte(message))
}

// MONGODB //
const host string = "mongo"
const db string = "jassDb"

// GetMongo returns the session an reference to the post collecion
func GetMongo(col string) (context.Context, *mongo.Collection) {
	ctx := context.Background()

	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://root:root@" + host + ":27017"))
	if err != nil {
		log.Fatal(err)
	}
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	collection := client.Database(db).Collection(col)
	return ctx, collection
}

//////// GRAPHQL ////////
var graphqlSchema *graphql.Schema

/*

	game(ID: ID!): Game
	trumpf(ID: ID!): Trumpf
	round(ID: ID!): Round

*/

// Schema describes the data that we ask for
var Schema = `
    schema {
        query: Query
    }
    # The Query type represents all of the entry points.
    type Query {
		user(name: String!): User
	}
    type User {
        ID: ID!
        name: String!
	}
	type Game {
		ID: ID!
		user: User!
	}
	type Trumpf {
		ID: ID!
		name: String!
		multiplier: Int!
	}
	type Round {
		ID: ID!
		trumpf: Trumpf!
		game: Game!
	}
	type Team {
		ID: ID!
		name: String!
	}
	type Points {
		ID: ID!
		round: Round!
		team: Team!
	}
	`

// Cleanup will remove all mock data from the database.
func Cleanup(col string) {
	log.Println("Cleaning up MongoDB...")
	ctx, collection := GetMongo(col)

	_, err := collection.DeleteMany(ctx,
		bson.D{})
	if err != nil {
		log.Fatal(err)
	}
}

func init() {
	// MustParseSchema parses a GraphQL schema and attaches the given root resolver.
	// It returns an error if the Go type signature of the resolvers does not match the schema.
	graphqlSchema = graphql.MustParseSchema(Schema, &Resolver{})

	log.Println("Seeding mock data to MongoDB")
	// Call GetMongo, session and reference to the post collection
	ctx, collection := GetMongo("user")
	// Close the session so its resources may be put back in the pool or collected, depending on the case.

	// Cleanup finds all documents matching the provided selector document
	// and removes them from the database. So we make sure the db is empty before inserting mock data.
	Cleanup("user")

	// The mock data that we insert.
	_, err := collection.InsertMany(
		ctx,
		[]interface{}{
			bson.D{
				bson.E{"ID", 1},
				bson.E{"name", "Benny Joe"},
			},
			bson.D{
				bson.E{"ID", 2},
				bson.E{"name", "David--K"},
			},
			bson.D{
				bson.E{"ID", 3},
				bson.E{"name", "Moschi"},
			},
		},
	)

	if err != nil {
		log.Fatal(err)
	}
	log.Println("Mock data added successfully!")
}

//////// RESOLVER ////////
// In order to respond to queries, a schema needs to have resolve functions for all fields.
// Go’s structs are typed collections of fields. They’re useful for grouping data together to form records.
type Resolver struct{}

// data types //

type user struct {
	ID   graphql.ID
	Name string
}

// type game struct {
// 	ID   graphql.ID
// 	user user
// }

// type trumpf struct {
// 	ID         graphql.ID
// 	Name       string
// 	Multiplier int
// }

// type round struct {
// 	ID     graphql.ID
// 	trumpf trumpf
// }

// type team struct {
// 	ID   graphql.ID
// 	Name string
// }

// type points struct {
// 	ID         graphql.ID
// 	team       team
// 	round      round
// 	wiispoints int
// 	points     int
// }

// end data types //

// resolvers //

type userResolver struct {
	s *user
}

// type gameResolver struct {
// 	s *game
// }

// type trumpfResolver struct {
// 	s *trumpf
// }

// type roundResolver struct {
// 	s *round
// }

// type teamResolver struct {
// 	s *team
// }

// type pointsResolver struct {
// 	s *points
// }

// end resolvers //

type searchResultResolver struct {
	result interface{}
}

// Slices can be created with the built-in make function; this is how we create dynamically-sized arrays.
var userData = make(map[string]*user)

// var gameData = make(map[string]*game)
// var trumpfData = make(map[string]*trumpf)
// var teamData = make(map[string]*team)
// var pointsData = make(map[string]*points)

// resolver User queries
func (r *Resolver) User(args struct{ Name string }) *userResolver {
	oneResult := &user{}

	ctx, collection := GetMongo("user")
	single := collection.FindOne(
		ctx,
		bson.M{
			"name": args.Name,
		})

	single.Decode(oneResult)

	if s := oneResult; s != nil {
		return &userResolver{oneResult}
	}

	return nil
}

// // resolver Game queries
// func (r *Resolver) Game(args struct{ ID graphql.ID }) *gameResolver {
// 	oneResult := &game{}

// 	ctx, collection := GetMongo("game")
// 	cur, err := collection.Find(
// 		ctx,
// 		bson.D{
// 			bson.E{"ID", args.ID},
// 		},
// 	)
// 	if err != nil {
// 		fmt.Println(err)
// 	}
// 	defer cur.Close(ctx)
// 	for cur.Next(ctx) {
// 		cur.Decode(oneResult)
// 	}

// 	if s := oneResult; s != nil {
// 		return &gameResolver{oneResult}
// 	}

// 	return nil
// }

// func (r *gameResolver) ID() graphql.ID {
// 	return r.s.ID
// }

// func (r *gameResolver) User() user {
// 	return r.s.user
// }

func (r *userResolver) ID() graphql.ID {
	return r.s.ID
}

func (r *userResolver) Name() string {
	return r.s.Name
}

//////// GRAPHiQL ////////
var page = []byte(`
    <!DOCTYPE html>
    <html>
        <head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/graphiql/0.10.2/graphiql.css" />
            <script src="https://cdnjs.cloudflare.com/ajax/libs/fetch/1.1.0/fetch.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.5.4/react.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.5.4/react-dom.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/graphiql/0.10.2/graphiql.js"></script>
        </head>
        <body style="width: 100%; height: 100%; margin: 0; overflow: hidden;">
            <div id="graphiql" style="height: 100vh;">Loading...</div>
            <script>
                function graphQLFetcher(graphQLParams) {
                    return fetch("/graphql", {
                        method: "post",
                        body: JSON.stringify(graphQLParams),
                        credentials: "include",
                    }).then(function (response) {
                        return response.text();
                    }).then(function (responseBody) {
                        try {
                            return JSON.parse(responseBody);
                        } catch (error) {
                            return responseBody;
                        }
                    });
                }
                ReactDOM.render(
                    React.createElement(GraphiQL, {fetcher: graphQLFetcher}),
                    document.getElementById("graphiql")
                );
            </script>
        </body>
    </html>
    `)

func main() {
	//http.HandleFunc("/", sayHello)

	// Write a GraphiQL page to /
	http.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write(page)
	}))

	// Create a handler for /graphql which passes cors for remote requests
	http.Handle("/graphql", cors.Default().Handler(&relay.Handler{Schema: graphqlSchema}))

	if err := http.ListenAndServe(":8080", nil); err != nil {
		panic(err)
	}
}
