package handlers

import (
	"github.com/gofiber/fiber/v2"

	l "github.com/3n3a/research-tool/lib"
)

var pageInfo = l.Page{
	AppName: "Research Tool",
	Title: "Research Tool",
	HomePage: "Home",
	MenuItems: []l.MenuItem{
		{
			Name: "Home",
			Link: "/",
			Active: false,
		},
		{
			Name: "Subdomains",
			Link: "/subdomains",
			Active: false,
		},
	    {
			Name: "DNS Lookup",
			Link: "/dns",
			Active: false,
		},
	},
}

// Home renders the home view
func Home(c *fiber.Ctx) error {
	return l.RenderView(c, pageInfo, "Home", "index")
}

// Subdomains renders the home view
func Subdomains(c *fiber.Ctx) error {
	domain := c.Query("domain")
	subdomains, err := l.GetSubdomains(domain)
	if err != nil {
		pageInfo.Message = err.Error()
		return l.RenderView(c, pageInfo, "Subdomains", "error")
	}
	pageInfo.Subdomains = subdomains
	return l.RenderView(c, pageInfo, "Subdomains", "subdomains")
}

// DNS Resolving
func DNSResolve(c *fiber.Ctx) error {
	domain := c.Query("domain")
	dnstype := c.Query("type")

	dnsres, err := l.LookupDNSRecord(domain, dnstype)
    if err != nil {
		pageInfo.Message = err.Error()
		return l.RenderView(c, pageInfo, "DNS Lookup", "error")
	}
	pageInfo.DNSRes = dnsres
	pageInfo.DNSTypes = l.GetDNSTypes()
	return l.RenderView(c, pageInfo, "DNS Lookup", "dns")
}

// NoutFound renders the 404 view
func NotFound(c *fiber.Ctx) error {
	return c.Status(404).Render("error", pageInfo)
}
