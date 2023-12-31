package handlers

import (
	"github.com/gofiber/fiber/v2"
)

// NoutFound renders the 404 view
func NotFound(c *fiber.Ctx) error {
	return c.Status(404).Render("error", pageInfo)
}