import { Component, computed, input, output, signal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';

import { DnsService } from '../../services/dns/dns.service';
import { DnsAnswer } from '../../types/dns-answer';
import { QuestionOption } from '../../types/question-option';
import { SubdomainAnswer } from '../../types/subdomain-answer';
import { DnsTableComponent } from '../dns-table/dns-table.component';

/** Resolver used for the records loaded inside an expanded row. */
const ROW_SOURCE = 'cloudflare';
const ROW_PROTOCOL = 'DoH';

type RowState = {
  records: DnsAnswer[];
  isLoading: boolean;
  errorMessage: string | null;
};

@Component({
  selector: 'comp-subdomains-table',
  imports: [
    FormsModule,
    RouterLink,
    ButtonModule,
    CardModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SelectModule,
    TableModule,
    DnsTableComponent,
  ],
  templateUrl: './subdomains-table.component.html',
  styleUrl: './subdomains-table.component.scss',
})
export class SubdomainsTableComponent {
  readonly records = input<SubdomainAnswer[]>([]);
  readonly isLoading = input<boolean>(false);

  readonly inspectIp = output<string>();

  readonly source = ROW_SOURCE;
  readonly protocol = ROW_PROTOCOL;

  /** p-table needs objects with a field to key, filter and sort on. */
  readonly rows = computed(() => this.records().map((name) => ({ name })));

  readonly dnsTypes: Signal<QuestionOption[] | undefined>;
  readonly recordType = signal<string>('A');

  /**
   * Hostnames whose row is open. Tracked here because p-table owns
   * `expandedRowKeys` and offers no change output for it.
   */
  private readonly expanded = signal<ReadonlySet<string>>(new Set());

  /** Records per record type and hostname, so reopening a row is free. */
  private readonly rowStates = signal<Record<string, RowState>>({});

  constructor(private dnsService: DnsService) {
    this.dnsTypes = toSignal(this.dnsService.dnsTypes(), { initialValue: [] });
  }

  state(name: string): RowState {
    return (
      this.rowStates()[this.key(name)] ?? { records: [], isLoading: true, errorMessage: null }
    );
  }

  onExpand(name: string) {
    this.expanded.update((names) => new Set(names).add(name));

    const key = this.key(name);
    if (this.rowStates()[key]) {
      return;
    }

    this.patch(key, { records: [], isLoading: true, errorMessage: null });
    this.dnsService.query(name, this.recordType(), ROW_SOURCE, ROW_PROTOCOL).subscribe({
      next: (records) => this.patch(key, { records, isLoading: false, errorMessage: null }),
      error: (error) =>
        this.patch(key, {
          records: [],
          isLoading: false,
          errorMessage: (error as Error).message,
        }),
    });
  }

  onCollapse(name: string) {
    this.expanded.update((names) => {
      const next = new Set(names);
      next.delete(name);
      return next;
    });
  }

  /** Rows already open still show the previous type, so reload them. */
  onRecordTypeSelected(type: string) {
    this.recordType.set(type);
    for (const name of this.expanded()) {
      this.onExpand(name);
    }
  }

  private key(name: string): string {
    return `${this.recordType()}:${name}`;
  }

  private patch(key: string, state: RowState) {
    this.rowStates.update((states) => ({ ...states, [key]: state }));
  }
}
