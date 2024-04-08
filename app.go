package main

import (
	"github.com/3n3a/research-tool/modules/dns"
	"github.com/3n3a/research-tool/modules/subdomains"
	"github.com/3n3a/research-tool/modules/ip"
	"github.com/3n3a/wapp"
)

var version string

func main() {
	// with config
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
