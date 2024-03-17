package utils

import (
	"errors"
	"fmt"
	"strings"

	"github.com/ada-url/goada"
)

func Normalize(inputUrl string) (string, error) {
	url, err := goada.New(inputUrl)
	if err != nil {
		return "", errors.New("url parsing failed")
	}

	return url.Href(), nil
}

func GetHostname(inputUrl string) (string, error) {
	// prepend http if only domain
	if !(strings.Contains(inputUrl, "http://") || strings.Contains(inputUrl, "https://")) {
		inputUrl = fmt.Sprintf("http://%s", inputUrl)
	}
	
	url, err := goada.New(inputUrl)
	if err != nil {
		return "", errors.New("url parsing failed")
	}

	return url.Hostname(), nil
}