import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { SharedProvidersModule } from '../shared.providers.module';
import { APIErrorResponse } from './api-error';

@Injectable({ providedIn: SharedProvidersModule })
export class APIErrorMapper {
  mapToErrorMessage<T>(source: Observable<T>): Observable<T> {
    return source.pipe(
      tap({
        error: console.log,
      }),
      catchError((err: APIErrorResponse) =>
        throwError(() => new Error(err?.error?.Message || err.message))
      )
    );
  }
}
