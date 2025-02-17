import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { SubdomainAnswer } from '../../types/subdomain-answer';

@Component({
  selector: 'comp-subdomains-table',
  imports: [CardModule, TableModule],
  templateUrl: './subdomains-table.component.html',
  styleUrl: './subdomains-table.component.scss'
})
export class SubdomainsTableComponent {
  readonly records = input<SubdomainAnswer[]>([])
  readonly isLoading = input<boolean>(false)

}