import { Component, computed, effect, input, output, untracked } from '@angular/core';
import { DynamicFormQuestionComponent } from '../dynamic-form-question/dynamic-form-question.component';
import { ReactiveFormsModule } from '@angular/forms';
import { QuestionBase } from '../../types/question-base';
import { DynamicFormService } from '../../services/dynamic-form/dynamic-form.service';
import { ButtonModule } from 'primeng/button';

/**
 * Created from example in angular docs:
 *
 * https://angular.dev/guide/forms/dynamic-forms
 */

/** Stable key for a set of answers, used to tell "same query" from "new query". */
function fingerprint(entries: Iterable<readonly [string, unknown]>): string {
  return [...entries]
    .map(([key, value]) => `${key}=${value || ''}`)
    .sort()
    .join('&');
}

@Component({
  selector: 'comp-dynamic-form',
  providers: [DynamicFormService],
  imports: [DynamicFormQuestionComponent, ReactiveFormsModule, ButtonModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
})
export class DynamicFormComponent<TPayload> {
  readonly questions = input<QuestionBase<string>[] | null>([]);
  readonly submitButtonText = input<string>("Submit");
  readonly isLoading = input<boolean>(false);

  payload = output<TPayload>();

  /**
   * The answers the questions currently carry. Deliberately ignores
   * `question.options`, which arrive asynchronously from the option endpoints
   * and must not count as a new query.
   */
  private readonly answers = computed(() =>
    fingerprint((this.questions() ?? []).map((q) => [q.key, q.value] as const)),
  );

  /**
   * Rebuilt whenever the answers change, not just once on init: the router
   * reuses this component when only query parameters change, so a drill-down
   * link from one page to itself has to swap the form out.
   */
  readonly form = computed(() => {
    this.answers();
    return untracked(() => this.qcs.toFormGroup(this.questions() ?? []));
  });

  /** Answers we already emitted, so one query never runs twice. */
  private emitted: string | null = null;

  constructor(private qcs: DynamicFormService) {
    // Preload the result when every field arrived prefilled, e.g. from query
    // parameters or a drill-down link.
    effect(() => {
      const form = this.form();
      const answers = this.answers();
      if (!form.valid || answers === this.emitted) {
        return;
      }
      this.emitted = answers;
      untracked(() => this.payload.emit(form.value));
    });
  }

  onSubmit() {
    const form = this.form();
    // Claim these answers up front: the page mirrors them back into the
    // questions, which would otherwise look like a new query to the effect.
    this.emitted = fingerprint(Object.entries(form.value));
    this.payload.emit(form.value);
  }
}
