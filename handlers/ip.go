package handlers

import (
	"github.com/gofiber/fiber/v2"

	common "github.com/3n3a/research-tool/lib/common"
	ip "github.com/3n3a/research-tool/lib/ip"
)

func SetupIP() {
	pageInfo.AddMenuEntry("IP Lookup", "/ip-address", 10)
	app.Get("/ip-address", IPLookup)
}

// IP Lookup
func IPLookup(c *fiber.Ctx) error {
	ipaddr := c.Query("ipaddr")
	additionalInfo := common.IPPage{}

	ipres, err := ip.LookupIPInfo(ipaddr)
	if err != nil {
		pageInfo.Message = err.Error()
		return common.RenderView(c, pageInfo, additionalInfo, "IP Lookup", "error")
	}
	additionalInfo.IPInfo = ipres
	return common.RenderView(c, pageInfo, additionalInfo, "IP Lookup", "ip")
}
