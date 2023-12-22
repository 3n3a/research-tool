# Start by building the application.
FROM golang:1.21 as build

WORKDIR /go/src/app
COPY . .

RUN go mod download

# RUN go install github.com/swaggo/swag/cmd/swag@latest && \
#     swag init # gen docs before building

RUN CGO_ENABLED=0 go build -o /go/bin/app

# Now copy it into our base image.
FROM gcr.io/distroless/static-debian11
COPY --from=build /go/bin/app /
CMD ["/app"]