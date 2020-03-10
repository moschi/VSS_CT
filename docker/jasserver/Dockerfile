FROM golang:latest
WORKDIR /go/src/path/app
COPY . .
RUN go build ./jasserver/app/server.go
CMD go run ./jasserver/app/server.go