package subdomains

import (
	"github.com/3n3a/wapp"
)

func New() wapp.Module {
	subdomains := wapp.NewModule(wapp.ModuleConfig{
		Name: "Subdomains",
		UIInputTitle: "Search",
		UIOutputTitle: "Subdomains of:",
		UIFields: []wapp.UIField{
			{
				Name: "domain",
				Type: wapp.UITypeText,
				Required: true,
			},
			{
				Name: "subdomains_source",
				Type: wapp.UITypeDropdown,
				Required: true,
				Default: "crtsh",
				Children: []wapp.UIChild{
					{
						DisplayValue: "crt.sh",
						Value: "crtsh",
					},
					{
						DisplayValue: "Arp Syndicate (Subdomain Center)",
						Value: "arpsyndicate",
					},
				},
			},
			{
				Name: "Search",
				Type: wapp.UITypeSubmit,
			},
		},
	})

	subdomains.AddAction(
		wapp.NewAction(func(ac *wapp.ActionCtx) error {
			domain := ac.FormValue("domain")
			source := ac.FormValue("subdomains_source")
		
			// TODO: validation
			// TODO: action field in table / kv --> DNS Page

			// get and output
			var res []wapp.Map = make([]wapp.Map, 0)
			if domain != "" && source != "" {
				resRaw, err := GetSubdomains(domain, source)
				if err != nil {
					return err
				}

				res = wapp.StructArrToMaps(resRaw.List)
			}
			
			return ac.RenderDataByAcceptHeader(
				res,
				"in_out_table",
			) 
		}),
	)

	return subdomains
}