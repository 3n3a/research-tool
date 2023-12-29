package handlers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"

	common "github.com/3n3a/research-tool/lib/common"
	dns "github.com/3n3a/research-tool/lib/dns"
	"github.com/3n3a/research-tool/lib/encoding"
	subdomains "github.com/3n3a/research-tool/lib/subdomains"
)

var pageInfo = common.Page{}

func SetupPage(version string) {
	pageInfo = common.Page{
		AppName: "Research Tool",
		Title: "Research Tool",
		Version: version,
		HomePage: "Home",
		MenuItems: []common.MenuItem{
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
			{
				Name: "Base64 Encode",
				Link: "/encoding",
				Active: false,
			},
			{
				Name: "Base64 Decode",
				Link: "/decoding",
				Active: false,
			},
		},
	}
	
}

// Home renders the home view
func Home(c *fiber.Ctx) error {
	return common.RenderView(c, pageInfo, "Home", "index")
}

// Subdomains renders the home view
func Subdomains(c *fiber.Ctx) error {
	domain := c.Query("domain")
	source := c.Query("source", "crtsh")

	subdomainsRes, err := subdomains.GetSubdomains(domain, source)
	if err != nil {
		pageInfo.Message = err.Error()
		return common.RenderView(c, pageInfo, "Subdomains", "error")
	}
	pageInfo.Subdomains = subdomainsRes
	pageInfo.SubdomainSources = subdomains.GetSubdomainSources()
	return common.RenderView(c, pageInfo, "Subdomains", "subdomains")
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

// Base64
func Base64Enc(c *fiber.Ctx) error {
	base64 := new(encoding.Base64) // input, encoding as fields

	if c.Method() == "POST" {
		if err := c.BodyParser(base64); err != nil {
			pageInfo.Message = err.Error()
			return common.RenderView(c, pageInfo, "Base64 Encode", "error")
		}

		fmt.Printf("%#v", base64)
	}

	pageInfo.BaseType = "Base64"
	pageInfo.BaseResult = base64.Encode()
	return common.RenderView(c, pageInfo, "Base64 Encode", "encoding")
}

func Base64Dec(c *fiber.Ctx) error {
	base64 := new(encoding.Base64) // input, encoding as fields

	if c.Method() == "POST" {
		if err := c.BodyParser(base64); err != nil {
			pageInfo.Message = err.Error()
			return common.RenderView(c, pageInfo, "Base64 Decode", "error")
		}
	}

	out, err := base64.Decode()
    if err != nil {
		pageInfo.Message = err.Error()
		return common.RenderView(c, pageInfo, "Base64 Decode", "error")
	}
	pageInfo.BaseType = "Base64"
	pageInfo.BaseResult = out
	return common.RenderView(c, pageInfo, "Base64 Decode", "decoding")
}

// NoutFound renders the 404 view
func NotFound(c *fiber.Ctx) error {
	return c.Status(404).Render("error", pageInfo)
}
