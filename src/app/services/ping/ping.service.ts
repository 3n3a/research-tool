import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PingResponse } from '../../types/ping-response';

@Injectable({
  providedIn: 'root'
})
export class PingService {

  constructor(private httpClient: HttpClient) { }

  ping() {
    return this.httpClient.get<PingResponse>("http://localhost:8000/ping/")
  }
}
