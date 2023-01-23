import { Injectable } from '@angular/core';
import {
  catchError,
  map,
  of,
  ReplaySubject,
  shareReplay,
  startWith,
} from 'rxjs';
import { User } from '../../../auth/models/user';

@Injectable({ providedIn: 'root' })
export class LoggedInUserService {
  constructor() {}

  private _user$ = new ReplaySubject<User>();
  public user$ = this._user$.asObservable();

  public isLoggedIn$ = this.user$.pipe(
    startWith(false),
    map((user) => !!user),
    catchError(() => of(false)),
    shareReplay()
  );
  setLoggedInUser(u: User) {
    this._user$.next(u);
  }

  setNoUser() {
    this._user$.next(null);
  }
}
