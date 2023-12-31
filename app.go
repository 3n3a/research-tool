package main

import (
	"time"

	server "github.com/3n3a/research-tool/lib/server"
)

var version string
var appConfig = server.AppConfig{
	CACHE_INCLUDE_RAW: "/public/*;/subdomains*",
	CACHE_LENGTH: 30 * time.Minute,
	APP_PORT: 3000,
	APP_STATIC_FILES: "./public",
	APP_VIEW_FILES:"./views",
	VERSION: version,
}


func main() {
	appConfig.Setup()
}
