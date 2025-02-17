import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuestionOption } from '../../types/question-option';
import { BaseResponse } from '../../types/base-response';
import { DnsAnswer } from '../../types/dns-answer';
import { catchError, map } from 'rxjs';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root',
})
export class DnsService extends BaseService {
  constructor(private httpClient: HttpClient) {
    super();
  }

  query(name: string, type: string, source: string, protocol: string) {
    return this.httpClient
      .post<BaseResponse<DnsAnswer[]>>('/dns/', {
        dns: { name: name, type: type, source: source, protocol: protocol},
      })
      .pipe(
        map((response) => response.data),
        catchError(super.handleError)
      );
  }

  dnsTypes() {
    return this.httpClient
      .get<BaseResponse<QuestionOption[]>>('/dns/types')
      .pipe(
        map((response) => response.data),
        catchError(super.handleError)
      );
  }

  dnsSources() {
    return this.httpClient
      .get<BaseResponse<QuestionOption[]>>('/dns/sources')
      .pipe(
        map((response) => response.data),
        catchError(super.handleError)
      );
  }

  dnsProtocol() {
    return this.httpClient
      .get<BaseResponse<QuestionOption[]>>('/dns/protocols')
      .pipe(
        map((response) => response.data),
        catchError(super.handleError)
      );
  }
}
