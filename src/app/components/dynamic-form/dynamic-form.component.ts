import { Component, OnInit, Signal, input, output } from '@angular/core';
import { DynamicFormQuestionComponent } from '../dynamic-form-question/dynamic-form-question.component';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import { QuestionBase } from '../../types/question-base';
import { DynamicFormService } from '../../services/dynamic-form/dynamic-form.service';
import { ButtonModule } from 'primeng/button';
import { DnsForm } from '../../types/dns-form';

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
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent implements OnInit {
  readonly questions = input<QuestionBase<string>[] | null>([]);
  readonly submitButtonText = input<string>("Submit");
  readonly isLoading = input<boolean>(false);

  form!: FormGroup;
  payload = output<DnsForm>();

  constructor(private qcs: DynamicFormService) {}

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions() as QuestionBase<string>[]);
  }

  onSubmit() {
    this.payload.emit(this.form.value)
  }
}
