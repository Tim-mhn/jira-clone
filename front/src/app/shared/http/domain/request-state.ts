import { map, ReplaySubject } from 'rxjs';

/**
 * Object to handle the state of any Observable - especially HTTP calls. This can be used in components to conditionnally
 * show loading spinners, errors / success messages.
 *
 * Comment on the implementation
 * Using 3 properties instead of a single enum property with PENDING / ERROR / SUCCESS values to make it easily accessible in the template
 * With enums we would have have to do
 * ```
 * <div *ngIf="requestState.state === RequestStateEnum.PENDING"> ... </div> }}
 * ```
 *
 * With this implementation, we just need to do this
 *  ```
 * <div *ngIf="requestState.isPending"> ... </div>
 * ```
 *
 * Using pipes with @class RequestState as an input would not work because the instance is the same (only the properties get updated)
 * We could have used:
 * - impure pipes to execute the pipe on every lifecycle hook (but this adds a lot of executions)
 * - pass a @property state as an input instead of @class RequestState, but this makes it less handy to use
 */
export class RequestState {
  public isError = false;
  public isSuccess = false;
  public isPending = false;
  private _stateChanged$ = new ReplaySubject<void>();
  public stateChanged$ = this._stateChanged$.asObservable();
  public isPending$ = this._stateChanged$.pipe(map(() => this.isPending));
  public isError$ = this._stateChanged$.pipe(map(() => this.isError));

  public error: Error;
  public toError(err?: Error) {
    this.isPending = false;
    this.isError = true;
    this.isSuccess = false;
    this.error = err;
    this._stateChanged$.next();
  }

  public toSuccess() {
    this.isPending = false;
    this.isError = false;
    this.isSuccess = true;
    this._stateChanged$.next();
  }

  public toPending() {
    this.isPending = true;
    this.isError = false;
    this.isSuccess = false;
    this._stateChanged$.next();
  }
}
