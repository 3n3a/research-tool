package server

// Should only be imported by app.go

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"slices"
	"strings"
	"time"

	"github.com/3n3a/research-tool/handlers"
	"github.com/3n3a/research-tool/lib/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cache"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/template/html/v2"
)

const (
	ENV_NAME = "ENVIRONMENT"
)

type AppConfig struct {
	VERSION string
	CACHE_INCLUDE_RAW string
	CACHE_INCLUDE     []string
	CACHE_LENGTH      time.Duration
	APP_PORT          int
	APP_STATIC_FILES  string
	APP_VIEW_FILES    string
	ENVIRONMENT       string
}

func (a *AppConfig) Setup() {
	// Setup Cache Includes
	a.CACHE_INCLUDE = slices.DeleteFunc(
		strings.Split(a.CACHE_INCLUDE_RAW, ";"),
		func(e string) bool {
			return e == ""
		},
	)

	// ENv
	a.ENVIRONMENT = os.Getenv("ENVIRONMENT")

	// Print config
	fmt.Printf("=== App Configuration ===\n")
	configJson, _ := json.MarshalIndent(a, "", "  ")
	fmt.Printf("%s\n", configJson)

	// Set Version to DEV
	if utils.IsDev() {
		a.VERSION = "devel"
	}

	// start Gofiber server
	a.setupServer()
}

func (a *AppConfig) setupServer() {
	// Create view engine
	engine := html.New(a.APP_VIEW_FILES, ".html")

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

	engine.AddFunc("getJsAsset", func(name string) (res template.HTML) {
		filepath.Walk("public/assets", func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}
			if info.Name() == name {
				res = template.HTML("<script src=\"/" + path + "\"></script>")
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
				for _, pathMatch := range a.CACHE_INCLUDE {
					match, _ := regexp.MatchString(pathMatch, c.Path())
					if match {
						return false // cached
					}
				}
				return true // not cached
			},
			Expiration:   a.CACHE_LENGTH,
			CacheControl: true,
			KeyGenerator: func(c *fiber.Ctx) string {
				return c.OriginalURL()
			},
		}))
	}

	// Setup routes & configure handlers
	handlers.SetupPage(a.VERSION, app)

	// Setup static files
	app.Static("/public", a.APP_STATIC_FILES)

	// Handle not founds
	app.Use(handlers.NotFound)

	// Listen on port 3000
	log.Fatal(app.Listen(fmt.Sprintf(":%d", a.APP_PORT)))
}