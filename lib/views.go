package lib

import (
	"github.com/gofiber/fiber/v2"
)

// View Tools
type MenuItem struct {
	Name string
	Link string
	Active bool
}

type Page struct {
	AppName string
	Title string
	HomePage string
	MenuItems []MenuItem

	Message string
	
	Subdomains Subdomains

	DNSRes DNSRes
	DNSTypes []string
}

func activateCurrentMenuItem(pageInfo Page, Name string) error {
	for i, item := range pageInfo.MenuItems {
		if item.Name == Name {
			pageInfo.MenuItems[i].Active = true
		} else {
			pageInfo.MenuItems[i].Active = false
		}
	}
	return nil
}

func RenderView(c *fiber.Ctx, pageInfo Page, pageName string, templName string) error {
	activateCurrentMenuItem(pageInfo, pageName)
	pageInfo.Title = pageName
	return c.Render(templName, pageInfo)
}
