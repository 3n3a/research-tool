import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export function httpInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  //return next(req);

  // Clone the requst to enable including of credentials so "mode: cors" is being implied
  const newReq = req.clone({
    withCredentials: true,
  })
  return next(newReq);
}
