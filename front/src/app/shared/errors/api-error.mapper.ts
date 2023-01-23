import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { SharedProvidersModule } from '../shared.providers.module';
import { APIErrorResponse } from './api-error';

@Injectable({ providedIn: SharedProvidersModule })
export class APIErrorMapper {
  mapToErrorMessage<T>(source: Observable<T>): Observable<T> {
    return source.pipe(
      catchError((err: APIErrorResponse) =>
        throwError(() => new Error(err?.error?.Message || err.message))
      )
    );
  }
}
