import {
  Component,
  computed,
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

@Component({
  selector: 'pages-dns',
  imports: [DynamicFormComponent, DnsTableComponent],
  templateUrl: './dns.component.html',
  styleUrl: './dns.component.scss',
  })
export class DnsComponent {
  dnsTypes: Signal<QuestionOption[] | undefined> = signal([]);
  questions: Signal<QuestionBase<string>[]> = computed(() => [
    new TextboxQuestion({
      key: 'domain',
      label: 'Domain Name',
      required: true,
      order: 1,
    }),
    new DropdownQuestion({
      key: 'dns_type',
      label: 'Record Type',
      required: true,
      order: 2,
      value: 'A',
      options: this.dnsTypes(),
    }),
  ]);

  /**
   * Use WritableSignal to be able to update outside of initializer (constructor)
   * - `toSignal` is not possible outside of initializer
   * - see in `onSubmit`, subscribe to observable and `.set()` the signal
   */
  dnsAnswers: WritableSignal<DnsAnswer[] | undefined> = signal([]);
  dnsAnswersLoading: WritableSignal<boolean> = signal(false);

  constructor(private dnsService: DnsService) {
    this.dnsTypes = toSignal(this.dnsService.dnsTypes());
  }

  onSubmit(payload: DnsForm) {
    this.dnsAnswersLoading.set(true);
    this.dnsService
      .query(payload.domain, payload.dns_type)
      .subscribe((dnsAnswers) => {
        this.dnsAnswers.set(dnsAnswers);
        this.dnsAnswersLoading.set(false);
      });
  }
}
