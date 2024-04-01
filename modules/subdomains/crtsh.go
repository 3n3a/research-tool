package subdomains

import (
	"fmt"
	"slices"
	"strings"

	utils "github.com/3n3a/research-tool/lib/utils"
	"github.com/smirzaei/parallel"
)

type SubdomainCRTSH struct {
	IssueCaId      int    `json:"issuer_ca_id"`
	IssuerName     string `json:"issuer_name"`
	CommonName     string `json:"common_name"`
	NameValue      string `json:"name_value"`
	Id             int    `json:"id"`
	EntryTimestamp string `json:"entry_timestamp"`
	NotBefore      string `json:"not_before"`
	NotAfter       string `json:"not_after"`
	SerialNumber   string `json:"serial_number"`
	ResultCount    int    `json:"result_count"`
}

type SubdomainResCRTSH []SubdomainCRTSH

func GetSubdomainsCRTSH(domain string) (Subdomains, error) {
	// https://crt.sh/?q=%.example.com&output=json&exclude=expired

	client := utils.NewHTTPClient()

	subdomainRes := SubdomainResCRTSH{}

	if domain == "" {
		return Subdomains{
			List:   make([]SubdomainElement, 0),
		}, nil
	}
	_, err := client.R().
		SetQueryParams(map[string]string{
			"q":       "%." + domain,
			"output":  "json",
			"exclude": "expired",
		}).
		SetHeader("Accept", "application/json").
		SetResult(&subdomainRes).
		Get("https://crt.sh")

	list := make([]string, 0)
	exclusions := []string{fmt.Sprintf("*.%s", domain), domain}

	for _, sub := range subdomainRes {
		// should exclude domains that equal with *.example.com or example.com
		// should include ones that include the domain
		if ( ! slices.Contains[[]string, string](exclusions, sub.CommonName) ) && strings.Contains(sub.CommonName, domain) {
			list = append(list, sub.CommonName)
		}
	}

	list = utils.UniqueNonEmptyElementsOf(list)

	outList := make([]SubdomainElement, 0)
	parallel.ForEach(list, func(el string) {
		outList = append(outList, SubdomainElement{
			Hostname: fmt.Sprintf("%s%s", SUBDOMAINS_PREFIX, el),
			Domain: el,
		})
	})

	return Subdomains{
		List:   outList,
	}, err
}