package handlers

import (
	"github.com/gofiber/fiber/v2"

	common "github.com/3n3a/research-tool/lib/common"
	dns "github.com/3n3a/research-tool/lib/dns"
)

func SetupDns() {
	pageInfo.AddMenuEntry("DNS Lookup", "/dns", 2)
	app.Get("/dns", DNSResolve)
}

// DNS Resolving
func DNSResolve(c *fiber.Ctx) error {
	domain := c.Query("domain")
	dnstype := c.Query("type")
	additionalInfo := common.DnsPage{}

	dnsres, err := dns.LookupDNSRecord(domain, dnstype)
	if err != nil {
		pageInfo.Message = err.Error()
		return common.RenderView(c, pageInfo, additionalInfo, "DNS Lookup", "error")
	}
	additionalInfo.DNSRes = dnsres
	additionalInfo.DNSTypes = dns.GetDNSTypes()
	return common.RenderView(c, pageInfo, additionalInfo, "DNS Lookup", "dns")
}
