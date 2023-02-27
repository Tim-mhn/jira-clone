import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Provider } from '@angular/core';
import { WithCredentialsInterceptor } from './with-credentials.interceptor';

export const HTTP_INTERCEPTORS_PROVIDERS: Provider = {
  provide: HTTP_INTERCEPTORS,
  multi: true,
  useClass: WithCredentialsInterceptor,
};
