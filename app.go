package main

import (
	"fmt"
	"path/filepath"
	"html/template"
	"os"
	"regexp"
	"strings"
	"time"
	"slices"
	"log"

	"github.com/3n3a/research-tool/handlers"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/cache"
	"github.com/gofiber/template/html/v2"	
)

const (
	CACHE_INCLUDE = "/public/*;/subdomains*"
	CACHE_LENGTH = 30 * time.Minute
)

func main() {
	var cacheIncludeSlice = slices.DeleteFunc(
		strings.Split(CACHE_INCLUDE, ";"),
		func(e string) bool {
			return e == ""
	})
	fmt.Println("Caching Paths:", cacheIncludeSlice)

	// Create view engine
	engine := html.New("./views", ".html")

	// Disable this in production
	// TODO: only when dev, with env var
	//engine.Reload(true)

	engine.AddFunc("getCssAsset", func(name string) (res template.HTML) {
		filepath.Walk("public/assets", func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}
			if info.Name() == name {
				res = template.HTML("<link rel=\"stylesheet\" href=\"/" + path + "\">")
			}
			return nil
		})
		return
	})

	// Create fiber app
	app := fiber.New(fiber.Config{
		Views:       engine,
		ViewsLayout: "layouts/main",
	})

	// Middleware
	app.Use(recover.New())
	app.Use(logger.New())
	app.Use(compress.New())
	app.Use(cache.New(cache.Config{
		Next: func(c *fiber.Ctx) bool {
			for _, pathMatch := range cacheIncludeSlice {
				match, _ := regexp.MatchString(pathMatch, c.Path())
				if match {
					return false
				}
			}
			return true
		},
		Expiration: CACHE_LENGTH,
		CacheControl: true, 
  KeyGenerator: func(c *fiber.Ctx) string {
			return c.OriginalURL()
		},
	}))

	// Setup routes
	app.Get("/", handlers.Home)
	app.Get("/subdomains", handlers.Subdomains)
	app.Get("/dnsresolve", handlers.DNSResolve)

	// Setup static files
	app.Static("/public", "./public")

	// Handle not founds
	app.Use(handlers.NotFound)

	// Listen on port 3000
	log.Fatal(app.Listen(":3000"))
}
