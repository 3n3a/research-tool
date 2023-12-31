package handlers

import (
	"github.com/gofiber/fiber/v2"

	common "github.com/3n3a/research-tool/lib/common"
)

func SetupHome() {
	AddMenuEntry("Home", "/", 0)

	app.Get("/", Home)
}

// Home renders the home view
func Home(c *fiber.Ctx) error {
	return common.RenderView(c, pageInfo, "Home", "index")
}