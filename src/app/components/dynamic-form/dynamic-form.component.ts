import { Component, OnInit, Signal, input, output } from '@angular/core';
import { DynamicFormQuestionComponent } from '../dynamic-form-question/dynamic-form-question.component';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import { QuestionBase } from '../../types/question-base';
import { DynamicFormService } from '../../services/dynamic-form/dynamic-form.service';
import { ButtonModule } from 'primeng/button';

/**
 * Created from example in angular docs:
 *
 * https://angular.dev/guide/forms/dynamic-forms
 */

@Component({
  selector: 'comp-dynamic-form',
  providers: [DynamicFormService],
  imports: [DynamicFormQuestionComponent, ReactiveFormsModule, ButtonModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
  standalone: true
})
export class DynamicFormComponent<TPayload> implements OnInit {
  readonly questions = input<QuestionBase<string>[] | null>([]);
  readonly submitButtonText = input<string>("Submit");
  readonly isLoading = input<boolean>(false);

  form!: FormGroup;
  payload = output<TPayload>();

  constructor(private qcs: DynamicFormService) {}

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions() as QuestionBase<string>[]);
    // preload result from query parameter if all fields filled
    if (this.form.valid) {
      console.log('submitting early')
      this.onSubmit()
    }
  }

  onSubmit() {
    this.payload.emit(this.form.value)
  }
}
