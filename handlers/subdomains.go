package handlers

import (
	"github.com/gofiber/fiber/v2"

	common "github.com/3n3a/research-tool/lib/common"
	subdomains "github.com/3n3a/research-tool/lib/subdomains"
)

func SetupSubdomains() {
	pageInfo.AddMenuEntry("Subdomains", "/subdomains", 1)

	app.Get("/subdomains", Subdomains)
}

// Subdomains renders the home view
func Subdomains(c *fiber.Ctx) error {
	domain := c.Query("domain")
	source := c.Query("source", "crtsh")
	additionalInfo := common.SubdomainPage{}

	subdomainsRes, err := subdomains.GetSubdomains(domain, source)
	if err != nil {
		pageInfo.Message = err.Error()
		return common.RenderView(c, pageInfo, additionalInfo, "Subdomains", "error")
	}
	additionalInfo.Subdomains = subdomainsRes
	additionalInfo.SubdomainSources = subdomains.GetSubdomainSources()
	return common.RenderView(c, pageInfo, additionalInfo, "Subdomains", "subdomains")
}
