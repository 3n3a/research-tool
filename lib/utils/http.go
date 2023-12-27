package utils

import (
	"crypto/tls"

	"github.com/go-resty/resty/v2"
)

func NewHTTPClient() *resty.Client {
	client := resty.New()
	client.SetTLSClientConfig(&tls.Config{ InsecureSkipVerify: true })
	client.SetHeader("User-Agent", "research-tool/1.0 (https://github.com/3n3a/research-tool)")

	if IsDev() {
		// Dumps HTTP Req and Res
		client.SetDebug(true)
	}

	return client
}