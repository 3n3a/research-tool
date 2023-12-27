package subdomains

import (
	"errors"
	"slices"
)

type Subdomains struct {
	Domain string
	Source string
	List   []string
}

type SubdomainSources map[string]string

func GetSubdomainSources() SubdomainSources {
	return SubdomainSources{
		"crtsh": "crt.sh",
		"arpsyndicate": "Arp Syndicate (Subdomain.Center)",
	}
}

func GetSubdomains(domain string, source string) (Subdomains, error) {
	// default
	subdomains := Subdomains{
		List:   make([]string, 0),
	}
	err := errors.New("subdomains source does not exist")
	
	// get from source
	switch source {
		case "arpsyndicate":
			subdomains, err = GetSubdomainsARPSyndicate(domain)
		case "crtsh":
			subdomains, err = GetSubdomainsCRTSH(domain)
	}

	// sort
	slices.Sort[[]string, string](subdomains.List)

	// todo: resolve all and set status on subdomain before returning

	// add context info
	subdomains.Source = source
	subdomains.Domain = domain
	
	return subdomains, err
}
