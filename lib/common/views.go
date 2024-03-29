package common

import (
	"slices"

	"github.com/3n3a/research-tool/lib/dns"
	"github.com/3n3a/research-tool/lib/ip"
	"github.com/3n3a/research-tool/lib/subdomains"
	"github.com/gofiber/fiber/v2"
)

// View Tools
type MenuItem struct {
	Name string
	Link string
	Active bool
	Order int
}

type Page struct {
	AppName string
	Title string
	Version string
	HomePage string
	MenuItems []MenuItem

	Message string
}

func (p *Page) SetTitle(title string) {
	p.Title = title
}

func (p *Page) ActivateMenuEntry(name string) {
	for i, item := range p.MenuItems {
		if item.Name == name {
			p.MenuItems[i].Active = true
		} else {
			p.MenuItems[i].Active = false
		}
	}
}

func (p *Page) AddMenuEntry(name string, link string, order int) {
	// Only add to Menu Once :)
	if !slices.ContainsFunc[[]MenuItem, MenuItem](p.MenuItems, func(mi MenuItem) bool {
		return mi.Name == name
	}) {
		p.MenuItems = append(p.MenuItems, MenuItem{
			Name: name,
			Link: link,
			Active: false,
			Order: order,
		})
	}
}

type DnsPage struct {
	DNSRes dns.DNSRes
	DNSTypes []string
}

type EncodingPage struct {
	BaseType string
	BaseInput string
	BaseResult string
}

type SubdomainPage struct {
	Subdomains subdomains.Subdomains
	SubdomainSources subdomains.SubdomainSources
}

type IPPage struct {
	IPInfo ip.IPRes
}

func (p *Page) SortMenu() {
	slices.SortFunc[[]MenuItem, MenuItem](p.MenuItems, func(a, b MenuItem) int {
		// a smaller than b
		if a.Order < b.Order {
			return -1
		}

		// a bigger than b
		if a.Order > b.Order {
			return 1
		}

		// equal order
		return 0
	})
}


func RenderView(c *fiber.Ctx, page Page, additional any, pageName string, templName string) error {
	page.SetTitle(pageName)
 page.ActivateMenuEntry(pageName)
	combinedInput := fiber.Map{
		"page": page,
		"other": additional,
	}
	return c.Render(templName, combinedInput)
}


func RenderElem(c *fiber.Ctx, page Page, additional any, templName string) error {
	combinedInput := fiber.Map{
		"page": page,
		"other": additional,
	}
	return c.Render(templName, combinedInput, "")
}
