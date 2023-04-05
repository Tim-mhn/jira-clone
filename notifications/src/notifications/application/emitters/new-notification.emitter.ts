import { Injectable } from '@nestjs/common';
import { Observable, Subject, filter } from 'rxjs';
import { User } from '../../../auth';
import { Notification } from '../../domain/models/notification';

@Injectable()
export class NewNotificationEmitter {
  private _newNotification$ = new Subject<Notification<any>>();

  public newNotification$ = this._newNotification$.asObservable();

  fireNewNotificationEvent(n: Notification<any>) {
    this._newNotification$.next(n);
  }

  public getNotificationStreamOfUser(
    user: User,
  ): Observable<Notification<any>> {
    return this._newNotification$.pipe(
      filter((notif) => notif.isForUser(user)),
    );
  }
}
