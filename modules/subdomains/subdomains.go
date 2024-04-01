package subdomains

import (
	"errors"
	// "net"
	"slices"
	"strings"
)

const (
	SUBDOMAINS_PREFIX = "https://"
)

type SubdomainElement struct {
	Domain string
	Hostname string
}

type Subdomains struct {
	Domain string
	Source string
	List   []SubdomainElement
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
		List:   make([]SubdomainElement, 0),
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
	slices.SortFunc[[]SubdomainElement, SubdomainElement](subdomains.List, func(a, b SubdomainElement) int {
		return strings.Compare(a.Hostname, b.Hostname)
	})

	// for i, subdomainEl := range subdomains.List {
	// 	subdomains.List[i].Resolvable = domainHasIPs(subdomainEl.Hostname)
	// }

	// add context info
	subdomains.Source = source
	subdomains.Domain = domain
	
	return subdomains, err
}

// func domainHasIPs(hostname string) bool {
// 	_, err := net.LookupIP(hostname)
// 	return err != nil
// }