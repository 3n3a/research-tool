import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { DropdownQuestion } from '../../types/question-dropdown';
import { QuestionBase } from '../../types/question-base';
import { TextboxQuestion } from '../../types/question-textbox';
import { DynamicFormComponent } from './dynamic-form.component';

type Payload = { domain: string; source: string };

function questions(domain: string | undefined, source: string, options: string[] = []) {
  return [
    new TextboxQuestion({ key: 'domain', label: 'Domain Name', required: true, value: domain }),
    new DropdownQuestion({
      key: 'source',
      label: 'Source',
      required: true,
      value: source,
      options: options.map((option) => ({ key: option, value: option })),
    }),
  ] as QuestionBase<string>[];
}

describe('DynamicFormComponent', () => {
  let fixture: ComponentFixture<DynamicFormComponent<Payload>>;
  let emitted: Payload[];

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [DynamicFormComponent] });
    fixture = TestBed.createComponent<DynamicFormComponent<Payload>>(DynamicFormComponent);

    emitted = [];
    fixture.componentInstance.payload.subscribe((payload) => emitted.push(payload));
  });

  it('submits on its own once every answer arrived prefilled', () => {
    fixture.componentRef.setInput('questions', questions('example.com', 'crtsh'));
    fixture.detectChanges();

    expect(emitted).toEqual([{ domain: 'example.com', source: 'crtsh' }]);
  });

  it('waits while an answer is still missing', () => {
    fixture.componentRef.setInput('questions', questions(undefined, 'crtsh'));
    fixture.detectChanges();

    expect(emitted).toEqual([]);
  });

  it('submits again when a drill-down link changes the answers', () => {
    fixture.componentRef.setInput('questions', questions('example.com', 'crtsh'));
    fixture.detectChanges();

    fixture.componentRef.setInput('questions', questions('api.example.com', 'crtsh'));
    fixture.detectChanges();

    expect(emitted).toEqual([
      { domain: 'example.com', source: 'crtsh' },
      { domain: 'api.example.com', source: 'crtsh' },
    ]);
  });

  it('does not resubmit when only the dropdown options arrive', () => {
    fixture.componentRef.setInput('questions', questions('example.com', 'crtsh'));
    fixture.detectChanges();

    // The option endpoints answer after the first render.
    fixture.componentRef.setInput('questions', questions('example.com', 'crtsh', ['crtsh', 'all']));
    fixture.detectChanges();

    expect(emitted).toHaveLength(1);
  });

  it('does not resubmit the answers a manual submit already sent', () => {
    fixture.componentRef.setInput('questions', questions(undefined, 'crtsh'));
    fixture.detectChanges();

    fixture.componentInstance.form().patchValue({ domain: 'typed.example.com' });
    fixture.componentInstance.onSubmit();

    // The page mirrors the payload back into the questions.
    fixture.componentRef.setInput('questions', questions('typed.example.com', 'crtsh'));
    fixture.detectChanges();

    expect(emitted).toEqual([{ domain: 'typed.example.com', source: 'crtsh' }]);
  });
});
