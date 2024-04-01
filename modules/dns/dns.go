package dns

import (
	"github.com/3n3a/research-tool/lib/utils"
	"github.com/3n3a/research-tool/modules/ip"
	"github.com/smirzaei/parallel"
)

type DNSQuestion struct {
    Name string `json:"name"`
    Type int `json:"type"`
}

type DNSAnswer struct {
    Name string `json:"name"`
    Type int `json:"type"`
	HumanType string `json:"human_type"`
	DisplayType string `json:"-"`
    TTL int `json:"TTL"`
    Data string `json:"data"`
}

func (d *DNSAnswer) TransformType() {
	d.HumanType = GetResourceRecordType(d.Type)
}

func (d *DNSAnswer) CalculateDisplayType() {
	if ip.ValidIP(d.Data) {
		d.DisplayType = "ipaddr"
	} else {
		d.DisplayType = ""
	}
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

const (
	LOOKUP_CONCURRENCY_LIMIT = 10
)

func LookupAnyDNSRecord(name string) (DNSRes, error) {
	var res DNSRes
	var err error

	parallel.ForEachLimit(GetDNSTypes(), LOOKUP_CONCURRENCY_LIMIT, func(dnstype string) {
		if dnstype != "ANY" {
			tempRes, tempErr := LookupDNSRecord(name, dnstype)
			res.Answer = append(res.Answer, tempRes.Answer...)
			err = tempErr
		}
	})

	res.DNSDomain = name
	res.DNSType = "ANY"

	return res, err
}

func LookupDNSRecord(name string, dnstype string) (DNSRes, error) {
	// Handle Empty Input Name
	if name == "" || dnstype == "" {
		return DNSRes{}, nil
	}

	// Any
	if dnstype == "ANY" {
		return LookupAnyDNSRecord(name)
	}

	// All other than ANY
	client := utils.NewHTTPClient()

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

	// process dns answers array
	var processedAnswers []DNSAnswer
	parallel.ForEach(dnsres.Answer, func(answer DNSAnswer) {
		answer.TransformType()
		answer.CalculateDisplayType()
		processedAnswers = append(processedAnswers, answer)
	})
	dnsres.Answer = processedAnswers

	return dnsres, err
}