import { Component, signal, Signal } from '@angular/core';
import { PingService } from '../../services/ping/ping.service';
import { PingResponse } from '../../types/ping-response';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'pages-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  pingResponse: Signal<PingResponse | undefined> = signal(undefined)

  constructor (private pingService: PingService, private messageService: MessageService) {
    this.pingResponse = this.pingService.ping()
    this.messageService.add({
      severity: 'info',
      summary: 'Successful',
      detail: 'Successfully retrieved ping from backend.',
      life: 2000,
    })
  }
}
