package subdomains

import (
	"fmt"

	utils "github.com/3n3a/research-tool/lib/utils"
)

type SubdomainResARPSyndicate []string

func GetSubdomainsARPSyndicate(domain string) (Subdomains, error) {
	client := utils.NewHTTPClient()

	subdomainRes := SubdomainResARPSyndicate{}

	if domain == "" {
		return Subdomains{
			List:   make([]string, 0),
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
		List:   subdomainRes,
	}, err
}