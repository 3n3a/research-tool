import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';
import { BaseResponse } from '../../types/base-response';
import { QuestionOption } from '../../types/question-option';
import { SubdomainAnswer } from '../../types/subdomain-answer';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class SubdomainsService extends BaseService {
  constructor(private httpClient: HttpClient) {
    super();
  }

  query(domain: string, source: string) {
    return this.httpClient
      .post<BaseResponse<SubdomainAnswer[]>>('/subdomains/', {
        subdomain: { domain: domain, source: source },
      })
      .pipe(
        map((response) => response.data.sort()), 
        catchError(super.handleError)
      );
  }

  subdomainsSources() {
    return this.httpClient
      .get<BaseResponse<QuestionOption[]>>('/subdomains/sources')
      .pipe(
        map((response) => response.data), 
        catchError(super.handleError)
      );
  }
}
