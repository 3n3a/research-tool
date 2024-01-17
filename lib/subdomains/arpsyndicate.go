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
			List: make([]SubdomainElement, 0),
		}, nil
	}
	_, err := client.R().
		SetQueryParams(map[string]string{
			"domain": domain,
		}).
		SetHeader("Accept", "application/json").
		SetResult(&subdomainRes).
		Get("https://api.subdomain.center")

	subdomainRes = utils.UniqueNonEmptyElementsOf(subdomainRes)

	outList := make([]SubdomainElement, 0)
	for _, el := range subdomainRes {
		outList = append(outList, SubdomainElement{
			Hostname: fmt.Sprintf("%s%s", SUBDOMAINS_PREFIX, el), 
			Domain: el,
		})
	}

	return Subdomains{
		List: outList,
	}, err
}
