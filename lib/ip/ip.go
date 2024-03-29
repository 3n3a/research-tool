package ip

import (
	"github.com/3n3a/research-tool/lib/utils"
	"github.com/muonsoft/validation/validate"
)

// api here: http://ip-api.com/json/{query}?fields=66846719
// docs: https://ip-api.com/docs/api:json

type IPRes struct {
	Query         string  `json:"query"`
	Status        string  `json:"status"`
	Continent     string  `json:"continent"`
	ContinentCode string  `json:"continentCode"`
	Country       string  `json:"country"`
	CountryCode   string  `json:"countryCode"`
	Region        string  `json:"region"`
	RegionName    string  `json:"regionName"`
	City          string  `json:"city"`
	District      string  `json:"district"`
	Zip           string  `json:"zip"`
	Lat           float64 `json:"lat"`
	Lon           float64 `json:"lon"`
	Timezone      string  `json:"timezone"`
	Offset        int     `json:"offset"`
	Currency      string  `json:"currency"`
	Isp           string  `json:"isp"`
	Org           string  `json:"org"`
	As            string  `json:"as"`
	AsName        string  `json:"asname"`
	Reverse       string  `json:"reverse"`
	Mobile        bool    `json:"mobile"`
	Proxy         bool    `json:"proxy"`
	Hosting       bool    `json:"hosting"`
}

func (i *IPRes) CalcOffset() {
	i.Offset = i.Offset / 3600
}

func LookupIPInfo(ipaddr string) (IPRes, error) {
	client := utils.NewHTTPClient()

	if len(ipaddr) < 4 {
		return IPRes{}, nil
	}

	resp, err := client.R().
		SetQueryParams(map[string]string{
			"fields": "66846719", // all fields
		}).
		SetHeader("Accept", "application/json").
		SetResult(&IPRes{}).
		Get("http://ip-api.com/json/" + ipaddr)

	ipres := *(resp.Result().(*IPRes))

	ipres.CalcOffset()

	return ipres, err
}

func ValidIP(inputIP string) bool {
	err := validate.IP(inputIP)
	return err == nil
}
