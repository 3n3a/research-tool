package handlers

import (
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

