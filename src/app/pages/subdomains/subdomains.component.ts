import { Component, computed, signal, Signal, WritableSignal } from '@angular/core';
import { QuestionBase } from '../../types/question-base';
import { TextboxQuestion } from '../../types/question-textbox';
import { DropdownQuestion } from '../../types/question-dropdown';
import { QuestionOption } from '../../types/question-option';
import { SubdomainsService } from '../../services/subdomains/subdomains.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { SubdomainForm } from '../../types/subdomain-form';
import { SubdomainAnswer } from '../../types/subdomain-answer';
import { DynamicFormComponent } from '../../components/dynamic-form/dynamic-form.component';

@Component({
  selector: 'pages-subdomains',
  imports: [DynamicFormComponent],
  templateUrl: './subdomains.component.html',
  styleUrl: './subdomains.component.scss',
  standalone: true,
})
export class SubdomainsComponent {
  subdomainsSources: Signal<QuestionOption[] | undefined> = signal([]);
  questions: Signal<QuestionBase<string>[]> = computed(() => [
    new TextboxQuestion({
      key: 'domain',
      label: 'Domain Name',
      required: true,
      order: 1,
    }),
    new DropdownQuestion({
      key: 'subdomain_source',
      label: 'Subdomain Source',
      required: true,
      order: 2,
      value: 'crtsh',
      options: this.subdomainsSources(),
    }),
  ]);

  subdomainAnswers: WritableSignal<SubdomainAnswer[] | undefined> = signal([]);
  subdomainAnswersLoading: WritableSignal<boolean> = signal(false);

  constructor(private subdomainsService: SubdomainsService) {
    this.subdomainsSources = toSignal(this.subdomainsService.subdomainsSources());
  }

  onSubmit(payload: SubdomainForm) {
    this.subdomainAnswersLoading.set(true);
    this.subdomainsService
      .query(payload.domain, payload.source)
      .subscribe((subdomainAnswersResponse) => {
        this.subdomainAnswers.set(subdomainAnswersResponse);
        this.subdomainAnswersLoading.set(false);
      });
  }
}
