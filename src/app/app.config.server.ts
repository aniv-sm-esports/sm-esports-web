import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import {provideHttpClient, withFetch, withInterceptorsFromDi} from '@angular/common/http';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideServerRouting(serverRoutes)
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
