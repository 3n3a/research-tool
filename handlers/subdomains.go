package handlers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"

	common "github.com/3n3a/research-tool/lib/common"
	subdomains "github.com/3n3a/research-tool/lib/subdomains"
	"github.com/3n3a/research-tool/lib/utils"
)

func SetupSubdomains() {
	pageInfo.AddMenuEntry("Subdomains", "/subdomains", 1)

	// Get Returns full Page, Post Only Returns the Subdomains Listing
	app.Get("/subdomains", Subdomains)
	app.Post("/subdomains", SubdomainsList)
}

// Subdomains renders the home view
func Subdomains(c *fiber.Ctx) error {
	domain := c.Query("domain")
	source := c.Query("source", "crtsh")
	additionalInfo := common.SubdomainPage{}
	additionalInfo.Subdomains.Domain = domain
	additionalInfo.Subdomains.Source = source
	additionalInfo.SubdomainSources = subdomains.GetSubdomainSources()
	return common.RenderView(c, pageInfo, additionalInfo, "Subdomains", "subdomains")
}

// SubdomainsList
func SubdomainsList(c *fiber.Ctx) error {
	domainRaw := c.FormValue("domain")
	source := c.FormValue("source", "crtsh")
	additionalInfo := common.SubdomainPage{}

	var domain string
	var err error
	domain, err = utils.GetHostname(domainRaw)
	if err != nil {
		pageInfo.Message = err.Error()
		utils.DevPrint("get hostname", pageInfo.Message)
		return common.RenderElem(c, pageInfo, additionalInfo, "error")
	}
	utils.DevPrint("get hostname", domain)

	subdomainsRes, err := subdomains.GetSubdomains(domain, source)
	if err != nil {
		pageInfo.Message = err.Error()
		return common.RenderElem(c, pageInfo, additionalInfo, "error")
	}
	additionalInfo.Subdomains = subdomainsRes
	additionalInfo.SubdomainSources = subdomains.GetSubdomainSources()

	c.Set("HX-Push-Url", fmt.Sprintf("/subdomains?domain=%s&source=%s", domain, source))

	return common.RenderElem(c, pageInfo, additionalInfo, "partials/subdomains-list")
}