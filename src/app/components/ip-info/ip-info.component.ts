import { Component, computed, input } from '@angular/core';

import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IpAddr } from '../../types/ip-addr';

type Fact = {
  label: string;
  value: string;
  /** Rendered as a tag instead of text when set. */
  flag?: boolean;
};

@Component({
  selector: 'comp-ip-info',
  imports: [TableModule, TagModule],
  templateUrl: './ip-info.component.html',
  styleUrl: './ip-info.component.scss',
})
export class IpInfoComponent {
  readonly ip = input<IpAddr | undefined>(undefined);
  readonly isLoading = input<boolean>(false);

  readonly facts = computed<Fact[]>(() => {
    const ip = this.ip();
    if (!ip) {
      return [];
    }

    const place = [ip.city, ip.district, ip.region_name, ip.country]
      .filter((part) => !!part)
      .join(', ');

    return [
      { label: 'IP', value: ip.query },
      { label: 'Reverse DNS', value: ip.reverse_dns },
      { label: 'Location', value: place },
      { label: 'Postal code', value: ip.zip_code },
      { label: 'Continent', value: `${ip.continent} (${ip.continent_code})` },
      { label: 'Coordinates', value: `${ip.lat}, ${ip.lon}` },
      { label: 'Timezone', value: `${ip.timezone} (UTC${ip.offset >= 0 ? '+' : ''}${ip.offset})` },
      { label: 'ISP', value: ip.isp },
      { label: 'Organization', value: ip.organization },
      { label: 'AS', value: [ip.as_number, ip.as_name].filter((part) => !!part).join(' ') },
      { label: 'Mobile network', value: '', flag: ip.is_mobile },
      { label: 'Proxy or VPN', value: '', flag: ip.is_proxy },
      { label: 'Hosting provider', value: '', flag: ip.is_hosting },
    ].filter((fact) => fact.flag !== undefined || !!fact.value);
  });
}
