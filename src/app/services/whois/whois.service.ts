import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';
import { BaseResponse } from '../../types/base-response';
import { WhoisInfo } from '../../types/whois-info';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root',
})
export class WhoisService extends BaseService {
  constructor(private httpClient: HttpClient) {
    super();
  }

  /** Proxied by the api: whois.enea.tech itself sends no cors headers. */
  query(domain: string) {
    return this.httpClient
      .post<BaseResponse<WhoisInfo>>('/whois/', {
        whois: { domain: domain },
      })
      .pipe(
        map((response) => response.data),
        catchError(super.handleError)
      );
  }
}
