FROM golang:latest
WORKDIR /go/src/path/app
COPY ./jasserver/app/ .
RUN go get github.com/graphql-go/graphql
RUN go get github.com/graph-gophers/graphql-go
RUN go get github.com/graph-gophers/graphql-go/relay
RUN go get go.mongodb.org/mongo-driver/mongo
RUN go get go.mongodb.org/mongo-driver/bson
RUN go get github.com/rs/cors
RUN go get gopkg.in/mgo.v2/bson
RUN go build ./server.go
CMD go run ./server.go