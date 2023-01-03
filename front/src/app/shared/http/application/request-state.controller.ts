import { Injectable } from '@angular/core';
import { defer, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RequestState } from '../domain/request-state';

@Injectable({
  providedIn: 'root',
})
export class RequestStateController {
  public handleRequest<T>(
    requestState?: RequestState
  ): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>) => {
      if (!requestState) return source;
      return defer(() => {
        // Will be called as soon as someone subscribes to the observable
        requestState.toPending();

        // Create new observable from obs updates RequestState on error and completion
        const sourceWithStateUpdate$ = source.pipe(
          tap({
            error: (err) => requestState.toError(err),
            complete: () => requestState.toSuccess(),
          })
        );

        return sourceWithStateUpdate$;
      });
    };
  }
}
