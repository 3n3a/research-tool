import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { BaseResponse } from '../../types/base-response';
import { QuestionOption } from '../../types/question-option';
import { SubdomainAnswer } from '../../types/subdomain-answer';

@Injectable({
  providedIn: 'root'
})
export class SubdomainsService {
  constructor(private httpClient: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);

    let errorMessage = 'An unexpected error occurred. Please try again later.';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server returned code ${error.status}, message: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }

  query(domain: string, source: string) {
    return this.httpClient
      .post<BaseResponse<SubdomainAnswer[]>>('/subdomains/', {
        subdomain: { domain: domain, source: source },
      })
      .pipe(
        map((response) => response.data), 
        catchError(this.handleError)
      );
  }

  subdomainsSources() {
    return this.httpClient
      .get<BaseResponse<QuestionOption[]>>('/subdomains/sources')
      .pipe(
        map((response) => response.data), 
        catchError(this.handleError)
      );
  }
}
