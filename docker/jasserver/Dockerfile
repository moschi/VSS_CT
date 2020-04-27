FROM golang:latest
WORKDIR /go/src/jasserver/app
COPY ./jasserver/app/ .
COPY ./jasserver/app/models/ ./models
RUN go get github.com/lib/pq
RUN go get github.com/gorilla/mux
RUN go get github.com/jmoiron/sqlx
RUN go build ./server.go
CMD go run ./server.go