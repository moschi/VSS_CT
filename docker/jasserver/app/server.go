package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	graphql "github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/relay"
	"github.com/rs/cors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	//"gopkg.in/mgo.v2/bson"
)

// MONGODB //
// user host = mongo when running in docker, localhost for debugging outside of docker (but using mongo in docker)

const DEBUG bool = true // Switch between DEBUG and PRODUCTION: if true, host and port will be overwritten!

var host string = "mongo"
var port string = ":8080"

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
	trumpf(game: Game!): Trumpf
	round(game: Game!): Round
*/

// Schema describes the data that we ask for
var Schema = `
    schema {
        query: Query
    }
    # The Query type represents all of the entry points.
    type Query {
		user(name: String!): User
		game(userName: String!): Game
	}
    type User {
		id: ID!
		name: String!
		other: String!
	}
	type Game {
		id: ID!
		user: User!
	}
	type Trumpf {
		id: ID!
		name: String!
		multiplier: Int!
	}
	type Round {
		id: ID!
		trumpf: Trumpf!
		game: Game!
	}
	type Team {
		id: ID!
		name: String!
	}
	type Points {
		id: ID!
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

	if DEBUG {
		host = "localhost"
		port = ":9090"
	}

	// MustParseSchema parses a GraphQL schema and attaches the given root resolver.
	// It returns an error if the Go type signature of the resolvers does not match the schema.
	graphqlSchema = graphql.MustParseSchema(Schema, &Resolver{})

	log.Println("Seeding mock data to MongoDB")
	// Call GetMongo, session and reference to the post collection
	ctx, collection := GetMongo("user")
	// Close the session so its resources may be put back in the pool or collected, depending on the case.
	Cleanup("user")
	gameUser := bson.D{
		bson.E{Key: "name", Value: "Olaf"},
		bson.E{Key: "other", Value: "a"},
	}
	_, err := collection.InsertMany(
		ctx,
		[]interface{}{
			gameUser,
			bson.D{
				bson.E{Key: "name", Value: "David--K"},
				bson.E{Key: "other", Value: "b"},
			},
			bson.D{
				bson.E{Key: "name", Value: "Moschi"},
				bson.E{Key: "other", Value: "c"},
			},
			bson.D{
				bson.E{Key: "name", Value: "Hans"},
				bson.E{Key: "other", Value: "d"},
			},
		},
	)

	Cleanup("game")

	game := bson.D{
		bson.E{Key: "user", Value: gameUser},
	}
	ctx, collection = GetMongo("game")
	_, err = collection.InsertMany(ctx, []interface{}{game})

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

// user
type User struct {
	ID    graphql.ID
	Name  string
	Other string
}

type Game struct {
	ID   graphql.ID
	User User
}

type Trumpf struct {
	ID         graphql.ID
	Name       string
	Multiplier int
}

type Round struct {
	ID     graphql.ID
	Trumpf Trumpf
}

type Team struct {
	ID   graphql.ID
	Name string
}

type Points struct {
	ID         graphql.ID
	Team       Team
	Round      Round
	Wiispoints int
	Points     int
}

// end data types //

// resolvers //

type userResolver struct {
	s *User
}

type gameResolver struct {
	s *Game
}

type trumpfResolver struct {
	s *Trumpf
}

type roundResolver struct {
	s *Round
}

type teamResolver struct {
	s *Team
}

type pointsResolver struct {
	s *Points
}

// end resolvers //

type searchResultResolver struct {
	result interface{}
}

// Slices can be created with the built-in make function; this is how we create dynamically-sized arrays.
var userData = make(map[string]*User)
var gameData = make(map[string]*Game)
var trumpfData = make(map[string]*Trumpf)
var teamData = make(map[string]*Team)
var pointsData = make(map[string]*Points)

// resolver User queries
func (r *Resolver) User(args struct{ Name string }) *userResolver {
	var oneResult User

	ctx, collection := GetMongo("user")
	cur, err := collection.Find(
		ctx,
		bson.M{"name": args.Name},
	)
	if err != nil {
		fmt.Println(err)
	}
	defer cur.Close(ctx)
	for cur.Next(ctx) {
		cur.Decode(&oneResult)
		//log.Println(oneResult)
	}

	if s := &oneResult; s != nil {
		return &userResolver{&oneResult}
	}

	return nil
}

// resolver Game queries
func (r *Resolver) Game(args struct{ UserName string }) *gameResolver {
	var oneResult Game
	ctx, collection := GetMongo("game")
	cur, err := collection.Find(
		ctx,
		bson.D{},
	)

	// filter currently not working
	//bson.M{"user": bson.M{"name": args.UserName}},
	if err != nil {
		log.Println(err)
	}

	defer cur.Close(ctx)
	for cur.Next(ctx) {
		cur.Decode(&oneResult)
		log.Println(oneResult)
	}

	if s := &oneResult; s != nil {
		return &gameResolver{&oneResult}
	}

	return nil
}

// field resolving //

func (r *userResolver) ID() graphql.ID {
	return r.s.ID
}

func (r *userResolver) Name() string {
	return r.s.Name
}

func (r *userResolver) Other() string {
	return r.s.Other
}

func (r *gameResolver) ID() graphql.ID {
	return r.s.ID
}

func (r *gameResolver) User() *userResolver {
	return &userResolver{&r.s.User}
}

func (r *trumpfResolver) ID() graphql.ID {
	return r.s.ID
}

func (r *trumpfResolver) Name() string {
	return r.s.Name
}

func (r *trumpfResolver) Multiplier() int {
	return r.s.Multiplier
}

func (r *roundResolver) ID() graphql.ID {
	return r.s.ID
}

func (r *roundResolver) Trumpf() Trumpf {
	return r.s.Trumpf
}

func (r *teamResolver) ID() graphql.ID {
	return r.s.ID
}

func (r *teamResolver) Name() string {
	return r.s.Name
}

func (r *pointsResolver) ID() graphql.ID {
	return r.s.ID
}

func (r *pointsResolver) Team() Team {
	return r.s.Team
}

func (r *pointsResolver) Round() Round {
	return r.s.Round
}

func (r *pointsResolver) Wiispoints() int {
	return r.s.Wiispoints
}

func (r *pointsResolver) Points() int {
	return r.s.Points
}

// end field resolving //

// used for sexy interface ;)
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
	log.Println(host)
	log.Println(port)

	// Write a GraphiQL page to /
	http.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write(page)
	}))

	// Create a handler for /graphql which passes cors for remote requests
	http.Handle("/graphql", cors.Default().Handler(&relay.Handler{Schema: graphqlSchema}))

	// use port 9090 for local debugging (since its hopefully free) and 8080 for using in docker
	if err := http.ListenAndServe(port, nil); err != nil {
		panic(err)
	}
}
