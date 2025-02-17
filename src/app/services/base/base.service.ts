import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { throwError } from 'rxjs';

export class BaseService {
    protected handleError(error: HttpErrorResponse) {
        console.error('API Error:', error);

        let errorMessage = 'An unexpected error occurred. Please try again later.';

        if (!environment.production) {
            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = `Client-side error: ${error.error.message}`;
            } else {
                // Server-side error
                errorMessage = `Server returned code ${error.status}, message: ${error.message}`;
            }
        }

        return throwError(() => new Error(errorMessage));
    }
}
