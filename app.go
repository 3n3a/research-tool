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

// GetEnvAsUint16 retrieves an environment variable, parses it as uint64, and returns it as uint16.
// If the variable is not set or can't be parsed, it returns a default value.
func GetEnvAsUint16(key string, defaultValue uint16) uint16 {
    if value, err := strconv.ParseUint(os.Getenv(key), 10, 64); err == nil {
        return uint16(value) // Explicit cast to uint16
    }
    return defaultValue
}

func main() {
	// with config

	// get port from env, or otherwise default of wapp framework
	port := GetEnvAsUint16("PORT", 0)
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
