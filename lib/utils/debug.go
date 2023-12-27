package utils

import "os"

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
