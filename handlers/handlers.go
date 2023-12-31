package handlers

import (
	common "github.com/3n3a/research-tool/lib/common"
)

var pageInfo = common.Page{}

func SetupPage(version string) {
	pageInfo = common.Page{
		AppName: "Research Tool",
		Title: "Research Tool",
		Version: version,
		HomePage: "Home",
		MenuItems: []common.MenuItem{
			{
				Name: "Home",
				Link: "/",
				Active: false,
			},
			{
				Name: "Subdomains",
				Link: "/subdomains",
				Active: false,
			},
			{
				Name: "DNS Lookup",
				Link: "/dns",
				Active: false,
			},
			{
				Name: "Base64 Encode",
				Link: "/encoding",
				Active: false,
			},
			{
				Name: "Base64 Decode",
				Link: "/decoding",
				Active: false,
			},
		},
	}
}