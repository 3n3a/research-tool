package main

import (
	"os"
	"strconv"
	"github.com/3n3a/research-tool/modules/dns"
	"github.com/3n3a/research-tool/modules/subdomains"
	"github.com/3n3a/research-tool/modules/ip"
	"github.com/3n3a/wapp"
)

var version string

// GetEnvAsUint retrieves an environment variable and parses it to a uint.
// If the variable is not set or can't be parsed, it returns a default value.
func GetEnvAsUint(key string, defaultValue uint16) uint16 {
    // Get the environment variable as a string
    envVar := os.Getenv(key)
    
    // Try to parse the string to a uint
    if value, err := strconv.ParseUint(envVar, 10, 16); err == nil {
        return value
    }
    
    // Return the default value if parsing fails
    return defaultValue
}

func main() {
	// with config

	// get port from env, or otherwise default of wapp framework
	port := GetEnvAsUint("PORT", 0)
	w := wapp.New(wapp.Config{
		Name: "Research Tool",
		CoreModules: []wapp.CoreModule{
			wapp.Recover,
			wapp.Logger,
			wapp.CORS,
			wapp.Compress,
			// wapp.Cache,
		},
		Version: version,
		DebugMode: false,
		Port: port,
	})
	
	// Register Lowest Level Modules (not Submodules)
	w.Register(
		subdomains.New(),
		dns.New(),
		ip.New(),
	)

	// Start
	w.Start()
}
