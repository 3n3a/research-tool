import { Component, computed, Input, signal, Signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { DynamicFormComponent } from '../../components/dynamic-form/dynamic-form.component';
import { ErrorDisplayComponent } from '../../components/error-display/error-display.component';
import { WhoisInfoComponent } from '../../components/whois-info/whois-info.component';
import { WhoisService } from '../../services/whois/whois.service';
import { QuestionBase } from '../../types/question-base';
import { TextboxQuestion } from '../../types/question-textbox';
import { WhoisForm } from '../../types/whois-form';
import { WhoisInfo } from '../../types/whois-info';

@Component({
  selector: 'pages-whois',
  imports: [DynamicFormComponent, ErrorDisplayComponent, WhoisInfoComponent, RouterLink],
  templateUrl: './whois.component.html',
  styleUrl: './whois.component.scss',
})
export class WhoisComponent {
  qDomain = signal<string | undefined>(undefined);

  @Input()
  set domain(domain: string) {
    this.qDomain.set(domain);
  }

  questions: Signal<QuestionBase<string>[]> = computed(() => [
    new TextboxQuestion({
      key: 'domain',
      label: 'Domain Name',
      required: true,
      order: 1,
      value: this.qDomain(),
    }),
  ]);

  whoisAnswer: WritableSignal<WhoisInfo | undefined> = signal(undefined);
  whoisAnswerLoading: WritableSignal<boolean> = signal(false);

  errorMessage = signal<string | null>(null);

  /** The registered domain the answer is about, which can be a parent of the query. */
  readonly registered = computed(() => this.whoisAnswer()?.domain ?? this.qDomain());

  constructor(private whoisService: WhoisService, private router: Router) {}

  onSubmit(payload: WhoisForm) {
    this.whoisAnswerLoading.set(true);
    this.whoisAnswer.set(undefined);

    this.qDomain.set(payload.domain);

    this.router.navigate([], {
      queryParams: { domain: this.qDomain() },
      queryParamsHandling: 'replace',
    });

    this.whoisService.query(payload.domain.trim()).subscribe({
      next: (whois) => {
        this.whoisAnswer.set(whois);
        this.whoisAnswerLoading.set(false);
        this.errorMessage.set(null);
      },
      error: (error) => {
        this.whoisAnswerLoading.set(false);
        this.errorMessage.set((error as Error).message);
      },
    });
  }
}
