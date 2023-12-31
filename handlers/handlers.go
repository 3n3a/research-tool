package handlers

import (
	"slices"

	common "github.com/3n3a/research-tool/lib/common"
	"github.com/gofiber/fiber/v2"
)

var pageInfo = common.Page{
	AppName: "Research Tool",
	Title: "Research Tool",
	HomePage: "Home",
	MenuItems: []common.MenuItem{},
}
var app *fiber.App

func SetupPage(version string, currentApp *fiber.App) {
	pageInfo.Version = version
	app = currentApp

	SetupHome()
	SetupDns()
	SetupEncoding()
	SetupSubdomains()

	pageInfo.SortMenu()
}

func AddMenuEntry(name string, link string, order int) {
	// Only add to Menu Once :)
	if !slices.ContainsFunc[[]common.MenuItem, common.MenuItem](pageInfo.MenuItems, func(mi common.MenuItem) bool {
		return mi.Name == name
	}) {
		pageInfo.MenuItems = append(pageInfo.MenuItems, common.MenuItem{
			Name: name,
			Link: link,
			Active: false,
			Order: order,
		})
	}
}