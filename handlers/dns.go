package handlers

import (
	"github.com/gofiber/fiber/v2"

	common "github.com/3n3a/research-tool/lib/common"
	dns "github.com/3n3a/research-tool/lib/dns"
)

func SetupDns() {
	AddMenuEntry("DNS Lookup", "/dns", 2)

	app.Get("/dns", DNSResolve)
}

// DNS Resolving
func DNSResolve(c *fiber.Ctx) error {
	domain := c.Query("domain")
	dnstype := c.Query("type")

	dnsres, err := dns.LookupDNSRecord(domain, dnstype)
    if err != nil {
		pageInfo.Message = err.Error()
		return common.RenderView(c, pageInfo, "DNS Lookup", "error")
	}
	pageInfo.DNSRes = dnsres
	pageInfo.DNSTypes = dns.GetDNSTypes()
	return common.RenderView(c, pageInfo, "DNS Lookup", "dns")
}