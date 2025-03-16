import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { BaseResponse } from '../../types/base-response';
import { IpAddr } from '../../types/ip-addr';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IpService extends BaseService {
  constructor(private httpClient: HttpClient) {
    super();
  }

  queryIpInfo(query: string) {
    return this.httpClient
      .post<BaseResponse<IpAddr>>('/ip-addr/', {
        ip: { q: query }
      })
      .pipe(
        map((response) => response.data),
        catchError(super.handleError)
      )
  }

  currentIp() {
    return this.httpClient
      .get('https://ip.enea.tech', { responseType: 'text' })
      .pipe(
        map((response) => response),
        catchError(super.handleError)
      )
  }
}
