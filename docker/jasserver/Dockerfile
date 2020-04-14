FROM golang:latest
WORKDIR /go/src/path/app
COPY ./jasserver/app/ .
RUN go get github.com/lib/pq
RUN go build ./server.go
CMD go run ./server.go