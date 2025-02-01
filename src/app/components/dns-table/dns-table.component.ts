import { Component, input } from '@angular/core';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { DnsAnswer } from '../../types/dns-answer';

@Component({
  selector: 'comp-dns-table',
  imports: [CardModule, TableModule],
  templateUrl: './dns-table.component.html',
  styleUrl: './dns-table.component.scss',
  standalone: true,
})
export class DnsTableComponent {
  readonly records = input<DnsAnswer[]>([])
  readonly isLoading = input<boolean>(false)
}
