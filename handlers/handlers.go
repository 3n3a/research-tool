package handlers

import (
	"github.com/gofiber/fiber/v2"

	l "github.com/3n3a/research-tool/lib"
)

var pageInfo = l.Page{
	AppName: "Research Tool",
	Title: "Research Tool",
	MenuItems: []l.MenuItem{
		l.MenuItem{
			Name: "Home",
			Link: "/",
			Active: false,
		},
	},
}



// Home renders the home view
func Home(c *fiber.Ctx) error {
	return l.RenderView(c, pageInfo, "Home", "index")
}

// NoutFound renders the 404 view
func NotFound(c *fiber.Ctx) error {
	return c.Status(404).Render("404", pageInfo)
}
