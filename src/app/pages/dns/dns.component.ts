import {
  Component,
  computed,
  Input,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { DynamicFormComponent } from '../../components/dynamic-form/dynamic-form.component';
import { QuestionBase } from '../../types/question-base';
import { TextboxQuestion } from '../../types/question-textbox';
import { DnsForm } from '../../types/dns-form';
import { DnsService } from '../../services/dns/dns.service';
import { DropdownQuestion } from '../../types/question-dropdown';
import { QuestionOption } from '../../types/question-option';
import { DnsAnswer } from '../../types/dns-answer';
import { DnsTableComponent } from '../../components/dns-table/dns-table.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { ErrorDisplayComponent } from "../../components/error-display/error-display.component";
import { Router } from '@angular/router';

@Component({
  selector: 'pages-dns',
  imports: [DynamicFormComponent, DnsTableComponent, ErrorDisplayComponent],
  templateUrl: './dns.component.html',
  styleUrl: './dns.component.scss',
})
export class DnsComponent {
  qDomain = signal<string | undefined>(undefined)
  qDnsType = signal<string | undefined>(undefined)
  qDnsSource = signal<string | undefined>(undefined)
  qDnsProto = signal<string | undefined>(undefined)

  @Input()
  set domain(domain: string) {
    this.qDomain.set(domain);
  }

  @Input()
  set dns_type(dnsType: string) {
    this.qDnsType.set(dnsType);
  }

  @Input()
  set dns_source(dnsSource: string) {
    this.qDnsSource.set(dnsSource);
  }

  @Input()
  set dns_proto(dnsProto: string) {
    this.qDnsProto.set(dnsProto)
  }

  dnsTypes: Signal<QuestionOption[] | undefined> = signal([]);
  dnsSources: Signal<QuestionOption[] | undefined> = signal([]);
  dnsProtocols: Signal<QuestionOption[] | undefined> = signal([]);

  questions: Signal<QuestionBase<string>[]> = computed(() => [
    new TextboxQuestion({
      key: 'domain',
      label: 'Domain Name',
      required: true,
      value: this.qDomain(),
      order: 1,
    }),
    new DropdownQuestion({
      key: 'dns_type',
      label: 'Record Type',
      required: true,
      order: 2,
      value: this.qDnsType() || 'A',
      options: this.dnsTypes(),
    }),
    new DropdownQuestion({
      key: 'dns_source',
      label: 'Resolver',
      required: true,
      order: 2,
      value: this.qDnsSource() || 'cloudflare',
      options: this.dnsSources(),
    }),
    new DropdownQuestion({
      key: 'dns_proto',
      label: 'Protocol',
      required: true,
      order: 2,
      value: this.qDnsProto() || 'DoT',
      options: this.dnsProtocols(),
    }),
  ]);

  /**
   * Use WritableSignal to be able to update outside of initializer (constructor)
   * - `toSignal` is not possible outside of initializer
   * - see in `onSubmit`, subscribe to observable and `.set()` the signal
   */
  dnsAnswers: WritableSignal<DnsAnswer[] | undefined> = signal([]);
  dnsAnswersLoading: WritableSignal<boolean> = signal(false);

  errorMessage = signal<string | null>(null);

  constructor(private dnsService: DnsService, private router: Router) {
    try {
      const dnsTypes$ = this.dnsService.dnsTypes();
      const dnsSources$ = this.dnsService.dnsSources();
      const dnsProtocols$ = this.dnsService.dnsProtocol();
      this.dnsTypes = toSignal(dnsTypes$, { initialValue: [] });
      this.dnsSources = toSignal(dnsSources$, { initialValue: [] })
      this.dnsProtocols = toSignal(dnsProtocols$, { initialValue: [] })
    } catch (error) {
      this.errorMessage.set((error as Error).message);
    }
  }

  onSubmit(payload: DnsForm) {
    this.dnsAnswersLoading.set(true);

    // Update url input query params
    this.qDomain.set(payload.domain);
    this.qDnsType.set(payload.dns_type)
    this.qDnsSource.set(payload.dns_source);
    this.qDnsProto.set(payload.dns_proto);

    this.router.navigate([], {
      queryParams: {
        domain: this.qDomain(),
        dns_type: this.qDnsType(),
        dns_source: this.qDnsSource(),
        dns_proto: this.qDnsProto()
      },
      queryParamsHandling: 'replace',
      // replaceUrl: true, // Avoids pushing a new history entry
    });

    this.dnsService
      .query(payload.domain, payload.dns_type, payload.dns_source, payload.dns_proto)
      .subscribe({
        next: (dnsAnswers) => {
          this.dnsAnswers.set(dnsAnswers);
          this.dnsAnswersLoading.set(false);
        },
        error: (error) => {
          this.dnsAnswersLoading.set(false);
          this.errorMessage.set((error as Error).message)
        }
      });
  }
}
