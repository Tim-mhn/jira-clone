import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { User } from '../../../auth/models/user';

@Injectable({ providedIn: 'root' })
export class LoggedInUserService {
  constructor() {}

  private _user$ = new ReplaySubject<User>();
  public user$ = this._user$.asObservable();

  setLoggedInUser(u: User) {
    this._user$.next(u);
  }
}
