import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { BaseResponse } from '../../types/base-response';
import { QuestionOption } from '../../types/question-option';
import { SubdomainAnswer } from '../../types/subdomain-answer';

@Injectable({
  providedIn: 'root'
})
export class SubdomainsService {
  constructor(private httpClient: HttpClient) { }

  query(domain: string, source: string) {
    return this.httpClient
      .post<BaseResponse<SubdomainAnswer[]>>('/subdomains/', {
        subdomain: { domain: domain, source: source },
      })
      .pipe(map((response) => response.data));
  }

  subdomainsSources() {
    return this.httpClient
      .get<BaseResponse<QuestionOption[]>>('/subdomains/sources')
      .pipe(map((response) => response.data));
  }
}
