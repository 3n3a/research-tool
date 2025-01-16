import { Component, input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

import packageJson from '../../../../package.json';

@Component({
  selector: 'comp-app-top-bar',
  imports: [MenubarModule],
  templateUrl: './app-top-bar.component.html',
  styleUrl: './app-top-bar.component.scss'
})
export class AppTopBarComponent {
  readonly items = input<MenuItem[]>([]);

  version: string = packageJson.version;
}
