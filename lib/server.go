package lib

import (
	"encoding/json"
	"fmt"
	"os"
	"slices"
	"strings"
	"time"
)

const (
	ENV_NAME = "ENVIRONMENT"
)

type AppConfig struct {
	CACHE_INCLUDE_RAW string
	CACHE_INCLUDE     []string
	CACHE_LENGTH      time.Duration
	APP_PORT          int
	APP_STATIC_FILES  string
	APP_VIEW_FILES    string
	ENVIRONMENT       string
}

func (a *AppConfig) Setup() {
	// Setup Cache Includes
	a.CACHE_INCLUDE = slices.DeleteFunc(
		strings.Split(a.CACHE_INCLUDE_RAW, ";"),
		func(e string) bool {
			return e == ""
		},
	)

	// ENv
	a.ENVIRONMENT = os.Getenv("ENVIRONMENT")

	// Print Configuration
	fmt.Printf("=== App Configuration ===\n")
	configJson, _ := json.MarshalIndent(a, "", "  ")
	fmt.Printf("%s\n", configJson)
}

func IsDev() bool {
	env := os.Getenv(ENV_NAME)
	if env == "" || env == "prod" {
		return false
	}
	return true
}