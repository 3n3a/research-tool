package dns

import (
	"github.com/3n3a/research-tool/lib/utils"
	"github.com/3n3a/wapp"
)

func New() wapp.Module {
	dns := wapp.NewModule(wapp.ModuleConfig{
		Name: "DNS Lookup",
		InternalName: "dns",
		UIInputTitle: "Search",
		UIOutputTitle: "Response",
		UIFields: []wapp.UIField{
			{
				Name: "domain",
				Type: wapp.UITypeText,
				Required: true,
			},
			{
				Name: "dns_type",
				Type: wapp.UITypeDropdown,
				Required: true,
				Children: GetDNSTypesUI(),
			},
			{
				Name: "Search",
				Type: wapp.UITypeSubmit,
			},
		},
	})

	dns.AddAction(
		wapp.NewAction(func(ac *wapp.ActionCtx) error {
			domainRaw := ac.FormValue("domain")
			dnstype := ac.FormValue("dns_type")
		
			// TODO: validation
			// TODO: action field in table / kv --> ip Page

			// get and output
			var res []wapp.Map = make([]wapp.Map, 0)
			if domainRaw != "" && dnstype != "" {
				// get domain from input
				domain, err := utils.GetHostname(domainRaw)
				if err != nil {
					return err
				}
			
				dnsres, err := LookupDNSRecord(domain, dnstype)
				if err != nil {
					return err
				}

				res = wapp.StructArrToMaps(dnsres.Answer)
			}
			
			return ac.RenderDataByAcceptHeader(
				res,
				"in_out_table",
			) 
		}),
	)

	return dns
}