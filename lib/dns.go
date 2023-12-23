package lib

import (
	"crypto/tls"

	"github.com/go-resty/resty/v2"
)

type DNSQuestion struct {
    Name string `json:"name"`
    Type int `json:"type"`
}

type DNSAnswer struct {
    Name string `json:"name"`
    Type int `json:"type"`
    TTL int
    Data string `json:"data"`
}

type DNSRes struct {
	DNSDomain string
	DNSType string

	Status int
    TC bool
    RD bool
    RA bool
    AD bool
    CD bool
    Question []DNSQuestion
    Answer []DNSAnswer
}


func GetDNSTypes() []string {
	DNS_TYPE_LIST := []string{
		"A",
		"AAAA",
		"ANY",
		"CAA",
		"CNAME",
		"DNSKEY",
		"DS",
		"MX",
		"NS",
		"PTR",
		"SOA",
		"SRV",
		"TLSA",
		"TSIG",
		"TXT",
	}

	return DNS_TYPE_LIST
}

func LookupDNSRecord(name string, dnstype string) (DNSRes, error) {
	client := resty.New()
	client.SetTLSClientConfig(&tls.Config{ InsecureSkipVerify: true })
	client.SetDebug(true)

	if name == "" {
		return DNSRes{}, nil
	}
	resp, err := client.R().
		SetQueryParams(map[string]string{
    		"name": name,
            "type": dnstype,
		}).
		SetHeader("Accept", "application/dns-json").
		SetResult(&DNSRes{}).
		Get("https://cloudflare-dns.com/dns-query")

    // TODO: parse error codes
    // https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/make-api-requests/dns-json/

	dnsres := *(resp.Result().(*DNSRes))
	dnsres.DNSDomain = name
	dnsres.DNSType = dnstype

	return dnsres, err
}