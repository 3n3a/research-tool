package lib

import (
	"crypto/tls"

	"github.com/go-resty/resty/v2"
)

func NewHTTPClient() *resty.Client {
	client := resty.New()
	client.SetTLSClientConfig(&tls.Config{ InsecureSkipVerify: true })

	if IsDev() {
		// Dumps HTTP Req and Res
		client.SetDebug(true)
	}

	return client
}