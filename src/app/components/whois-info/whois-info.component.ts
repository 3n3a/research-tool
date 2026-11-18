import { DatePipe, JsonPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { WhoisInfo } from '../../types/whois-info';

type Fact = {
  label: string;
  value?: string | null;
  /** Rendered through the date pipe. */
  date?: string | null;
  /** Rendered as a link. */
  href?: string | null;
  /** Rendered as tags. */
  tags?: string[];
};

@Component({
  selector: 'comp-whois-info',
  imports: [DatePipe, JsonPipe, RouterLink, CardModule, TableModule, TagModule],
  templateUrl: './whois-info.component.html',
  styleUrl: './whois-info.component.scss',
})
export class WhoisInfoComponent {
  readonly whois = input<WhoisInfo | undefined>(undefined);
  readonly isLoading = input<boolean>(false);

  readonly facts = computed<Fact[]>(() => {
    const whois = this.whois();
    if (!whois) {
      return [];
    }

    const facts: Fact[] = [
      { label: 'Domain', value: whois.domain },
      { label: 'Source', value: whois.protocol === 'rdap' ? 'RDAP' : 'WHOIS' },
      { label: 'Registrar', value: whois.registrar, href: whois.registrar_url },
      { label: 'Registered', date: whois.created },
      { label: 'Updated', date: whois.updated },
      { label: 'Expires', date: whois.expires },
      { label: 'Status', tags: whois.status },
      {
        label: 'DNSSEC',
        value: whois.dnssec === null ? null : whois.dnssec ? 'signed' : 'unsigned',
      },
      { label: 'Handle', value: whois.handle },
    ];
    return facts.filter((fact) => !!fact.value || !!fact.date || !!fact.tags?.length);
  });

  readonly contacts = computed(() =>
    (this.whois()?.contacts ?? []).filter(
      (contact) => contact.name || contact.organization || contact.email,
    ),
  );
}
