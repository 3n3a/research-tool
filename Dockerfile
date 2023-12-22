# Start by building the application.
FROM node:20 as css

WORKDIR /app
COPY package*.json .
RUN npm i

COPY . .
RUN npm run build

# Build Golang App
FROM golang:1.21 as build

WORKDIR /go/src/app
COPY . .
COPY --from=css /app/public/assets/ ./public/assets

RUN go mod download

# RUN go install github.com/swaggo/swag/cmd/swag@latest && \
#     swag init # gen docs before building

RUN CGO_ENABLED=0 go build -o /go/bin/app

# Now copy it into our base image.
#FROM gcr.io/distroless/static-debian11
FROM ubuntu:22.04
COPY --from=build /go/bin/app /
COPY --from=build /go/src/app/views/ /views
COPY --from=build /go/src/app/public/ /public
CMD ["/app"]