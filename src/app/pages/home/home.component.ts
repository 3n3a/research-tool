import { Component, signal, Signal } from '@angular/core';
import { PingResponse, PingService } from '../../services/ping/ping.service';

@Component({
  selector: 'pages-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  pingResponse: Signal<PingResponse | undefined> = signal(undefined)

  constructor (private pingService: PingService) {
    this.pingResponse = this.pingService.ping()
  }
}
