import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './module/app-routing.module';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi} from '@angular/common/http';
import {AuthInterceptor} from './interceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
              provideRouter(routes),
              provideClientHydration(withEventReplay()),
              provideHttpClient(/*withFetch()*/ withInterceptorsFromDi())]
};
