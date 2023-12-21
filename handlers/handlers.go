package handlers

import (
	"github.com/gofiber/fiber/v2"

	s "github.com/3n3a/research-tool/system"
)

var pageInfo = s.Page{
	AppName: "Research Tool",
	Title: "Research Tool",
	MenuItems: []s.MenuItem{
		s.MenuItem{
			Name: "Home",
			Link: "/",
			Active: false,
		},
	},
	SysInfo: nil,
}



// Home renders the home view
func Home(c *fiber.Ctx) error {
	return s.renderView(c, "Home", "index")
}

// NoutFound renders the 404 view
func NotFound(c *fiber.Ctx) error {
	return c.Status(404).Render("404", pageInfo)
}
