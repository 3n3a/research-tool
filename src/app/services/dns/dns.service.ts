import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuestionOption } from '../../types/question-option';
import { BaseResponse } from '../../types/base-response';
import { DnsAnswer } from '../../types/dns-answer';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DnsService {
  constructor(private httpClient: HttpClient) {}

  query(name: string, type: string) {
    return this.httpClient
      .post<BaseResponse<DnsAnswer[]>>('/dns/', {
        dns: { name: name, type: type },
      })
      .pipe(map((response) => response.data));
  }

  dnsTypes() {
    return this.httpClient
      .get<BaseResponse<QuestionOption[]>>('/dns/types')
      .pipe(map((response) => response.data));
  }
}
