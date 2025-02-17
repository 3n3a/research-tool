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
import { SubdomainsTableComponent } from "../../components/subdomains-table/subdomains-table.component";
import { ErrorDisplayComponent } from "../../components/error-display/error-display.component";

@Component({
  selector: 'pages-subdomains',
  imports: [DynamicFormComponent, SubdomainsTableComponent, ErrorDisplayComponent],
  templateUrl: './subdomains.component.html',
  styleUrl: './subdomains.component.scss',
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
      key: 'source',
      label: 'Subdomain Source',
      required: true,
      order: 2,
      value: 'crtsh',
      options: this.subdomainsSources(),
    }),
  ]);

  subdomainAnswers: WritableSignal<SubdomainAnswer[] | undefined> = signal([]);
  subdomainAnswersLoading: WritableSignal<boolean> = signal(false);

  errorMessage = signal<string | null>(null);

  constructor(private subdomainsService: SubdomainsService) {
    try {
      const sources$ = this.subdomainsService.subdomainsSources();
      this.subdomainsSources = toSignal(sources$, { initialValue: [] });
    } catch (error) {
      this.errorMessage.set((error as Error).message)
    }
  }

  onSubmit(payload: SubdomainForm) {
    this.subdomainAnswersLoading.set(true);
    this.subdomainsService.query(payload.domain, payload.source)
      .subscribe({
        next: (subdomainAnswersResponse) => {
          this.subdomainAnswers.set(subdomainAnswersResponse);
          this.subdomainAnswersLoading.set(false);
        },
        error: (error) => {
          this.subdomainAnswersLoading.set(false);
          this.errorMessage.set((error as Error).message)
        }
      });
  }
}
