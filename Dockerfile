# Build Golang App
FROM golang:1.22 as build

WORKDIR /go/src/app
COPY . .

RUN go mod download && go get

# RUN go install github.com/swaggo/swag/cmd/swag@latest && \
#     swag init # gen docs before building

RUN go build -ldflags "-X main.version=$(git tag --sort=taggerdate | tail -1) -extldflags=-static" -buildvcs=false -o /go/bin/app

# Now copy it into our base image.
FROM gcr.io/distroless/static-debian11
COPY --from=build /go/bin/app /

ENV ENVIRONMENT="prod"

CMD ["/app"]
