package ip

import (
	"strings"

	"github.com/3n3a/wapp"
)

func New() wapp.Module {
	dns := wapp.NewModule(wapp.ModuleConfig{
		Name: "IP Lookup",
		InternalName: "ip",
		UIInputTitle: "Search",
		UIOutputTitle: "Response",
		UIFields: []wapp.UIField{
			{
				Name: "ip_or_hostname",
				Type: wapp.UITypeText,
				Required: true,
			},
			{
				Name: "Search",
				Type: wapp.UITypeSubmit,
			},
		},
	})

	dns.AddAction(
		wapp.NewAction(func(ac *wapp.ActionCtx) error {
			ip_or_hostname := ac.FormValue("ip_or_hostname")
			ip_or_hostname = strings.TrimSpace(ip_or_hostname)
		
			// TODO: validation
			// TODO: action field in table / kv --> ip Page

			// get and output
			var res []wapp.Map = make([]wapp.Map, 0)
			if ip_or_hostname != "" {
				ipres, err := LookupIPInfo(ip_or_hostname)
				if err != nil {
					return err
				}
				res = wapp.StructArrToMaps([]IPRes{ipres})
			}
			
			return ac.RenderDataByAcceptHeader(
				res,
				"in_out_kv",
			) 
		}),
	)

	return dns
}