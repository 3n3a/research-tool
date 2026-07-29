import { HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { describe, expect, it } from 'vitest';

import { environment } from '../../../environments/environment';
import { httpInterceptor } from './http.interceptor';

/** Captures the url the interceptor forwarded. */
function forward(url: string): string {
  let seen = '';
  const next = (request: HttpRequest<unknown>): Observable<HttpEvent<unknown>> => {
    seen = request.url;
    return of(new HttpResponse({ status: 200 }));
  };

  httpInterceptor(new HttpRequest('GET', url), next).subscribe();
  return seen;
}

describe('httpInterceptor', () => {
  it('resolves the relative urls the services use against the api', () => {
    // Every service calls e.g. '/subdomains/sources'; without this the browser
    // would resolve them against the frontend origin.
    expect(forward('/subdomains/sources')).toBe(
      new URL('/subdomains/sources', environment.apiUrl).toString(),
    );
  });

  it('keeps an absolute url on its own host', () => {
    // IpService.currentIp() calls a different origin outright.
    expect(forward('https://ip.enea.tech')).toBe('https://ip.enea.tech/');
  });
});
