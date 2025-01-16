import { Component, Input, OnInit } from '@angular/core';
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
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent implements OnInit {
  @Input() questions: QuestionBase<string>[] | null = [];
  form!: FormGroup;
  payLoad = '';

  constructor(private qcs: DynamicFormService) {}

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions as QuestionBase<string>[]);
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.getRawValue());
  }
}
