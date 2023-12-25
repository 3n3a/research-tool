package lib

import (
	"fmt"
)

type SubdomainResARPSyndicate []string

type SubdomainCRTSH struct {
	IssueCaId int `json:"issuer_ca_id"`
	IssuerName string `json:"issuer_name"`
	CommonName string `json:"common_name"`
	NameValue string `json:"name_value"`
	Id int `json:"id"`
	EntryTimestamp string `json:"entry_timestamp"`
	NotBefore string `json:"not_before"`
	NotAfter string `json:"not_after"`
	SerialNumber string `json:"serial_number"`
	ResultCount int `json:"result_count"`
}
type SubdomainResCRTSH []SubdomainCRTSH

type SubdomainTypes interface {
	SubdomainResARPSyndicate | SubdomainResCRTSH
}
type Subdomains[T SubdomainTypes] struct {
	Domain string
	List T // TOdo: make generic
}

func GetSubdomainsCRTSH(domain string) (Subdomains[SubdomainResCRTSH], error) {
	// https://crt.sh/?q=%.3n3a.ch&output=json&exclude=expired

	client := NewHTTPClient()

	subdomainRes := SubdomainResCRTSH{} 
	
	if domain == "" {
		return Subdomains[SubdomainResCRTSH]{
			List: make(SubdomainResCRTSH, 0),
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
		// todo: filter name value for only usable and unique ones
		subdomainRes[i] = fmt.Sprintf("http://%s", sub)
	}

	return Subdomains[SubdomainResCRTSH]{
		List: subdomainRes,
		Domain: domain,
	}, err
}

func GetSubdomainsARPSyndicate(domain string) (Subdomains[SubdomainResARPSyndicate], error) {
	client := NewHTTPClient()

	subdomainRes := SubdomainResARPSyndicate{} 
	
	if domain == "" {
		return Subdomains[SubdomainResARPSyndicate]{
			List: make(SubdomainResARPSyndicate, 0),
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

	return Subdomains[SubdomainResARPSyndicate]{
		List: subdomainRes,
		Domain: domain,
	}, err
}