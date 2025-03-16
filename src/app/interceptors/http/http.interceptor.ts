import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export function httpInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  // Second parameter is default base url if none other provided
  const newURL = new URL(req.url, environment.apiUrl);
  // Clone the requst to enable including of credentials so "mode: cors" is being implied
  const newReq = req.clone({
    url: newURL.toString(),
    // withCredentials: true,
  });
  return next(newReq);
}
