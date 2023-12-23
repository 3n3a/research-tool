package lib

import (
	"fmt"
)

type SubdomainRes []string
type Subdomains struct {
	Domain string
	List SubdomainRes
}

func GetSubdomains(domain string) (Subdomains, error) {
	client := NewHTTPClient()

	subdomainRes := SubdomainRes{} 
	
	if domain == "" {
		return Subdomains{
			List: make(SubdomainRes, 0),
			Domain: domain,
		}, nil
	}
	_, err := client.R().
		SetQueryParams(map[string]string{
			"domain": domain,
		}).
		SetHeader("Accept", "application/json").
		SetResult(&subdomainRes).
		Get("https://api.subdomain.center")

	for i, sub := range subdomainRes {
		subdomainRes[i] = fmt.Sprintf("http://%s", sub)
	}

	return Subdomains{
		List: subdomainRes,
		Domain: domain,
	}, err
}