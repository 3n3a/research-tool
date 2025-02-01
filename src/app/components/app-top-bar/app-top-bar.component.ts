import { Component, input, signal, Signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

import packageJson from '../../../../package.json';
import { PingService } from '../../services/ping/ping.service';
import { PingResponse } from '../../types/ping-response';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'comp-app-top-bar',
  imports: [MenubarModule],
  templateUrl: './app-top-bar.component.html',
  styleUrl: './app-top-bar.component.scss'
})
export class AppTopBarComponent {
  readonly items = input<MenuItem[]>([]);
  version: string = packageJson.version;
  pingResponse: Signal<PingResponse | undefined> = signal(undefined)

  constructor (private pingService: PingService) {
    this.pingResponse = toSignal(this.pingService.ping())
  }
}
