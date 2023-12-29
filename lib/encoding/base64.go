package encoding

import (
	b64 "encoding/base64"
	"strings"
)

// example: https://gobyexample.com/base64-encoding

type Base64 struct {
	Input string `form:"input"`
	Encoding string `form:"encoding"`
}

func (b *Base64) Encode() string {
	inputBytes := []byte(b.Input)
	output := ""

	if b.Input == "" {
		return ""
	}

	b.Input = strings.TrimSpace(b.Input)

	switch b.Encoding {
	case "url":
		output = b64.URLEncoding.EncodeToString(inputBytes)
	default:
		output = b64.StdEncoding.EncodeToString(inputBytes)
	}

	return output
}

func (b *Base64) Decode() (string, error) {
	var tempOut []byte
	var err error

	if b.Input == "" {
		return "", nil
	}

	b.Input = strings.TrimSpace(b.Input)

	switch b.Encoding {
	case "url":
		tempOut, err = b64.URLEncoding.DecodeString(b.Input)
	default:
		tempOut, err = b64.StdEncoding.DecodeString(b.Input)
	}

	return string(tempOut), err
}