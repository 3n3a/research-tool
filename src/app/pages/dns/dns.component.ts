import { Component } from '@angular/core';
import { DynamicFormComponent } from "../../components/dynamic-form/dynamic-form.component";
import { QuestionBase } from '../../types/question-base';
import { TextboxQuestion } from '../../types/question-textbox';

@Component({
  selector: 'pages-dns',
  imports: [DynamicFormComponent],
  templateUrl: './dns.component.html',
  styleUrl: './dns.component.scss'
})
export class DnsComponent {
  questions: QuestionBase<string>[] = [
    new TextboxQuestion({
      key: 'domain',
      label: 'Domain Name',
      required: true,
      order: 1,
    })
  ]
}
