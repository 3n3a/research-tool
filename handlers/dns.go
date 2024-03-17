package handlers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"

	common "github.com/3n3a/research-tool/lib/common"
	dns "github.com/3n3a/research-tool/lib/dns"
	"github.com/3n3a/research-tool/lib/utils"
)

func SetupDns() {
	pageInfo.AddMenuEntry("DNS Lookup", "/dns", 2)
	app.Get("/dns", DNSPage)
	app.Post("/dns", DNSResolve)
}

// Renders Home DNS
func DNSPage(c *fiber.Ctx) error {
	domain := c.Query("domain")
	dnstype := c.Query("type")
	additionalInfo := common.DnsPage{}

	additionalInfo.DNSRes = dns.DNSRes{
		DNSDomain: domain,
		DNSType: dnstype,
	}

	additionalInfo.DNSTypes = dns.GetDNSTypes()
	return common.RenderView(c, pageInfo, additionalInfo, "DNS Lookup", "dns")
}

// DNS Resolving
func DNSResolve(c *fiber.Ctx) error {
	var domain string
	var err error
	var dnsres dns.DNSRes

	domainRaw := c.FormValue("domain")
	dnstype := c.FormValue("type")
	additionalInfo := common.DnsPage{}

	if domainRaw != "" || dnstype != "" {
		// get domain from input
		domain, err = utils.GetHostname(domainRaw)
		if err != nil {
			pageInfo.Message = err.Error()
			utils.DevPrint("get hostname", pageInfo.Message)
			return common.RenderElem(c, pageInfo, additionalInfo, "error")
		}
	
		dnsres, err = dns.LookupDNSRecord(domain, dnstype)
		if err != nil {
			pageInfo.Message = err.Error()
			utils.DevPrint("lookup dns", pageInfo.Message)
			return common.RenderElem(c, pageInfo, additionalInfo, "error")
		}
	} else {
		pageInfo.Message = "please input value for domain and type"
		utils.DevPrint("no domain, dnstype value", pageInfo.Message)
		return common.RenderElem(c, pageInfo, additionalInfo, "error")
	}

	additionalInfo.DNSRes = dnsres

	c.Set("HX-Push-Url", fmt.Sprintf("/dns?domain=%s&type=%s", domain, dnstype))

	return common.RenderElem(c, pageInfo, additionalInfo, "partials/dns-list")
}
