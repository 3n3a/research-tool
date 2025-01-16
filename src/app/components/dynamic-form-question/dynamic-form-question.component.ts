import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { QuestionBase } from '../../types/question-base';

@Component({
  selector: 'comp-dynamic-form-question',
  imports: [ReactiveFormsModule],
  templateUrl: './dynamic-form-question.component.html',
  styleUrl: './dynamic-form-question.component.scss'
})
export class DynamicFormQuestionComponent {
  @Input() question!: QuestionBase<string>;
  @Input() form!: FormGroup;
  
  get isValid() {
    return this.form.controls[this.question.key].valid;
  }
}
