package utils

import (
	"fmt"
	"os"
)

const (
	ENV_NAME = "ENVIRONMENT"
)

func IsDev() bool {
	env := os.Getenv(ENV_NAME)
	if env == "" || env == "prod" {
		return false
	}
	return true
}

func DevPrint(where string, input string) {
	if IsDev() {
		fmt.Printf("%s: %s\n", where, input)
	}
}
