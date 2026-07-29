import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DnsAnswer } from '../../types/dns-answer';

/** What the `data` of a record points at, and so what you can do with it. */
export type DnsTarget =
  | { kind: 'ip'; value: string }
  | { kind: 'host'; value: string }
  | { kind: 'text'; value: string };

const IP_TYPES = ['A', 'AAAA'];
/** Types whose rdata ends in a hostname, mapped to the field that holds it. */
const HOST_TYPES: Record<string, 'only' | 'last'> = {
  CNAME: 'only',
  DNAME: 'only',
  NS: 'only',
  PTR: 'only',
  // "10 mx.example.com." and "0 5 5060 sip.example.com." both end in the name.
  MX: 'last',
  SRV: 'last',
};

/**
 * Classifies a record so the table knows whether its value can be inspected as
 * an ip, followed as a hostname, or just printed.
 */
export function dnsTarget(record: Pick<DnsAnswer, 'type' | 'data'>): DnsTarget {
  const data = (record.data ?? '').trim();
  const type = (record.type ?? '').toUpperCase();

  if (IP_TYPES.includes(type)) {
    return { kind: 'ip', value: data };
  }

  const position = HOST_TYPES[type];
  if (position) {
    const fields = data.split(/\s+/);
    const candidate = (position === 'last' ? fields[fields.length - 1] : fields[0])
      .replace(/\.$/, '')
      .toLowerCase();
    // A root target ("."), or anything that is not a name, is not followable.
    if (candidate.includes('.') && !candidate.includes('/')) {
      return { kind: 'host', value: candidate };
    }
  }

  return { kind: 'text', value: data };
}

type DnsRow = DnsAnswer & { target: DnsTarget };

@Component({
  selector: 'comp-dns-table',
  imports: [
    NgTemplateOutlet,
    RouterLink,
    ButtonModule,
    CardModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TableModule,
  ],
  templateUrl: './dns-table.component.html',
  styleUrl: './dns-table.component.scss',
})
export class DnsTableComponent {
  readonly records = input<DnsAnswer[]>([]);
  readonly isLoading = input<boolean>(false);
  /** Empty renders the table bare, for nesting inside an expanded row. */
  readonly heading = input<string>('DNS Records');
  /** Resolver the drill-down links should keep using. */
  readonly source = input<string>('cloudflare');
  readonly protocol = input<string>('DoH');

  readonly inspectIp = output<string>();

  readonly rows = computed<DnsRow[]>(() =>
    this.records().map((record) => ({ ...record, target: dnsTarget(record) })),
  );
}
