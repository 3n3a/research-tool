import { Component, input } from '@angular/core';

@Component({
  selector: 'comp-error-display',
  imports: [],
  templateUrl: './error-display.component.html',
  styleUrl: './error-display.component.scss'
})
export class ErrorDisplayComponent {
  readonly errorMessage = input<string | null>(null);
}
