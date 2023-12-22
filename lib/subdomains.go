package lib

import (
	"crypto/tls"

	"github.com/go-resty/resty/v2"
)

type SubdomainRes []string
type Subdomains struct {
	Domain string
	List SubdomainRes
}

func GetSubdomains(domain string) (Subdomains, error) {
	subdomainRes := SubdomainRes{} 

	client := resty.New()
	client.SetTLSClientConfig(&tls.Config{ InsecureSkipVerify: true })
	//client.SetDebug(true)

	_, err := client.R().
		SetQueryParams(map[string]string{
			"domain": domain,
		}).
		SetHeader("Accept", "application/json").
		SetResult(&subdomainRes).
		Get("https://api.subdomain.center")

	return Subdomains{
		List: subdomainRes,
		Domain: domain,
	}, err
}