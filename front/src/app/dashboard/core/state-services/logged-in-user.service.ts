import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, of } from 'rxjs';
import { User } from '../../../auth/models/user';

@Injectable({ providedIn: 'root' })
export class LoggedInUserService {
  constructor() {}

  private NO_USER: User = null;
  private _user$ = new BehaviorSubject<User>(this.NO_USER);
  public user$ = this._user$.asObservable();

  public isLoggedIn$ = this.user$.pipe(
    map((user) => !!user),
    catchError(() => of(false))
  );

  setLoggedInUser(u: User) {
    this._user$.next(u);
  }

  setNoUser() {
    this._user$.next(null);
  }
}
