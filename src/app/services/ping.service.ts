import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

// TODO: remove type from ehre
export type PingResponse = {
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class PingService {

  constructor(private httpClient: HttpClient) { }

  ping() {
    const ping$ = this.httpClient.get<PingResponse>("http://localhost:8000/ping/", { withCredentials: true })
    return toSignal<PingResponse>(ping$)
  }
}
