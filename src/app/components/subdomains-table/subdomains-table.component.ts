import { Component, computed, effect, input, output, signal, Signal, untracked, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { DnsService } from '../../services/dns/dns.service';
import { DnsAnswer } from '../../types/dns-answer';
import { QuestionOption } from '../../types/question-option';
import { ResolveResult, ResolveStatus } from '../../types/resolve-result';
import { SubdomainAnswer } from '../../types/subdomain-answer';
import { DnsTableComponent } from '../dns-table/dns-table.component';

/** Resolver used for the records loaded inside an expanded row. */
const ROW_SOURCE = 'cloudflare';
const ROW_PROTOCOL = 'DoH';

/** Which rows the dns status filter lets through. */
export type LivenessFilter = 'all' | 'active' | 'inactive';

/** What the status column shows: an answer, or that one is on its way. */
export type Liveness = ResolveStatus | 'pending';

/**
 * Whether a row passes the status filter. Rows without an answer yet are only
 * shown unfiltered: hiding them would make the page flicker as answers land.
 */
export function passesLiveness(filter: LivenessFilter, liveness: Liveness | undefined): boolean {
  if (filter === 'all') {
    return true;
  }
  return liveness === filter;
}

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
    SelectButtonModule,
    TableModule,
    TagModule,
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

  readonly table = viewChild<Table>('dt');

  readonly livenessFilters: { label: string; value: LivenessFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Resolving', value: 'active' },
    { label: 'Not resolving', value: 'inactive' },
  ];
  readonly livenessFilter = signal<LivenessFilter>('all');

  /**
   * Dns answers per hostname. Filled one page at a time (see resolvePage) so a
   * search with thousands of results never fires thousands of queries; the api
   * additionally caches every answer per resolver.
   */
  private readonly liveness = signal<Record<string, ResolveResult | 'pending'>>({});

  /** Rows of the current page the status filter hides. */
  readonly hiddenOnPage = signal(0);

  constructor(private dnsService: DnsService) {
    this.dnsTypes = toSignal(this.dnsService.dnsTypes(), { initialValue: [] });

    // New results: resolve their first page once the table has rendered them.
    effect(() => {
      this.records();
      untracked(() => setTimeout(() => this.resolvePage()));
    });

    effect(() => {
      this.livenessFilter();
      this.liveness();
      untracked(() => this.countHidden());
    });
  }

  status(name: string): Liveness | undefined {
    const answer = this.liveness()[name];
    return answer === 'pending' ? 'pending' : answer?.status;
  }

  addresses(name: string): string {
    const answer = this.liveness()[name];
    return answer && answer !== 'pending' ? answer.addresses.join(', ') : '';
  }

  isShown(name: string): boolean {
    return passesLiveness(this.livenessFilter(), this.status(name));
  }

  /**
   * Resolve the names on the page the table currently shows (after its own
   * text filter and sort), skipping any already answered or in flight.
   * Deferred because p-table updates `first` / the filtered value only after
   * emitting its page, sort and filter events.
   */
  resolvePage() {
    setTimeout(() => {
      const table = this.table();
      if (!table) {
        return;
      }
      const page = table.dataToRender(table.processedData) as { name: string }[];
      const known = this.liveness();
      const names = page.map((row) => row.name).filter((name) => !known[name]);
      this.countHidden();
      if (!names.length) {
        return;
      }

      this.liveness.update((states) => {
        const next = { ...states };
        for (const name of names) {
          next[name] = 'pending';
        }
        return next;
      });

      this.dnsService.resolve(names, ROW_SOURCE).subscribe({
        next: (results) =>
          this.liveness.update((states) => {
            const next = { ...states };
            for (const result of results) {
              next[result.name] = result;
            }
            return next;
          }),
        // Forget the names so the next page view retries them.
        error: () =>
          this.liveness.update((states) => {
            const next = { ...states };
            for (const name of names) {
              delete next[name];
            }
            return next;
          }),
      });
    });
  }

  private countHidden() {
    const table = this.table();
    if (!table) {
      this.hiddenOnPage.set(0);
      return;
    }
    const page = table.dataToRender(table.processedData) as { name: string }[];
    this.hiddenOnPage.set(page.filter((row) => !this.isShown(row.name)).length);
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
