import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { httpInterceptor } from './interceptors/http/http.interceptor';

import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import { AuraStandard } from './themes/aura-standard';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch(), withInterceptors([httpInterceptor])),
    // PrimeNG >= 20 animates with @primeuix/motion, so @angular/animations and
    // provideAnimationsAsync() are no longer needed.
    providePrimeNG({
      theme: {
        preset: AuraStandard,
      },
    }),
    MessageService
  ],
};
