package handlers

import (
	"github.com/gofiber/fiber/v2"
)

// NoutFound renders the 404 view
func NotFound(c *fiber.Ctx) error {
  combinedInput := fiber.Map{
    "page": pageInfo,
  }
	return c.Status(404).Render("error", combinedInput)
}