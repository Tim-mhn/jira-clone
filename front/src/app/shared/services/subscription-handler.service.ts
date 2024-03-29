import { Subject } from 'rxjs';

export class SubscriptionHandler {
  constructor() {}

  public static New() {
    return new SubscriptionHandler();
  }

  private _onDestroy$ = new Subject<void>();
  public onDestroy$ = this._onDestroy$.asObservable();

  destroy() {
    this._onDestroy$.next();
    this._onDestroy$.complete();
  }
}
