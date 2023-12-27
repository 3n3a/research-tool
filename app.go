package main

import (
	"fmt"
	"html/template"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"time"

	handlers "github.com/3n3a/research-tool/handlers"
	common "github.com/3n3a/research-tool/lib/common"
	utils "github.com/3n3a/research-tool/lib/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cache"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/template/html/v2"
)

var version string
var appConfig = common.AppConfig{
	CACHE_INCLUDE_RAW: "/public/*;/subdomains*",
	CACHE_LENGTH: 30 * time.Minute,
	APP_PORT: 3000,
	APP_STATIC_FILES: "./public",
	APP_VIEW_FILES:"./views",
	VERSION: version,
}


func main() {
	appConfig.Setup()
	handlers.SetupPage(appConfig.VERSION)

	// Create view engine
	engine := html.New(appConfig.APP_VIEW_FILES, ".html")

	if utils.IsDev() {
		engine.Reload(true)
	}

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
	if !utils.IsDev() {
		app.Use(compress.New())
		app.Use(cache.New(cache.Config{
			Next: func(c *fiber.Ctx) bool {
				for _, pathMatch := range appConfig.CACHE_INCLUDE {
					match, _ := regexp.MatchString(pathMatch, c.Path())
					if match {
						return false // cached
					}
				}
				return true // not cached
			},
			Expiration:   appConfig.CACHE_LENGTH,
			CacheControl: true,
			KeyGenerator: func(c *fiber.Ctx) string {
				return c.OriginalURL()
			},
		}))
	}

	// Setup routes
	app.Get("/", handlers.Home)
	app.Get("/subdomains", handlers.Subdomains)
	app.Get("/dns", handlers.DNSResolve)

	// Setup static files
	app.Static("/public", appConfig.APP_STATIC_FILES)

	// Handle not founds
	app.Use(handlers.NotFound)

	// Listen on port 3000
	log.Fatal(app.Listen(fmt.Sprintf(":%d", appConfig.APP_PORT)))
}
