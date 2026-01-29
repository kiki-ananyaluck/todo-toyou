import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { th_TH, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import th from '@angular/common/locales/th';
import { httpErrorInterceptor } from './services/http-error.interceptor';

registerLocaleData(th);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), 
    provideNzI18n(th_TH),
    provideHttpClient(withInterceptors([httpErrorInterceptor]))
  ]
};
