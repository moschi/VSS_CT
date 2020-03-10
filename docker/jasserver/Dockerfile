FROM golang:latest
WORKDIR /go/src/path/app
COPY ./jasserver/app/ .
RUN go get github.com/graphql-go/graphql
RUN go build ./server.go
CMD go run ./server.go