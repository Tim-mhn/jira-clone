import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { ProjectIdName } from '../../../core/models';
import { buildTaskPageRoute } from '../../browse/utils/build-browse-page-routes.util';
import { NotificationsAPI } from '../apis/notifications.api';
import { NotificationsMapper } from '../mappers/notifications.mapper';
import { NewNotifications, Notification, NotificationType } from '../models';
import { NotificationsProvidersModule } from '../notifications-providers.module';

@Injectable({
  providedIn: NotificationsProvidersModule,
})
export class NotificationsController {
  constructor(
    private api: NotificationsAPI,
    private router: Router,
    private mapper: NotificationsMapper
  ) {}

  public getNewNotificationsForCurrentUser(): Observable<NewNotifications> {
    return this.api.getNewNotifications().pipe(
      map((notifsDTO) => this.mapper.toDomain(notifsDTO)),
      tap(console.log)
    );
  }

  public goToTaskPageAndMarkNotificationAsRead<T extends NotificationType>(
    notification: Notification<T>
  ) {
    this.api
      .readNotification({
        id: notification.id,
        type: notification.type,
      })
      .subscribe();
    this._goToTaskPage(notification);
  }

  public readAllNotifications(notifications: NewNotifications) {
    const readNotificationsApiCalls$ = notifications.map((notif) =>
      this.api.readNotification({
        id: notif.id,
        type: notif.type,
      })
    );

    const markAllNotificationsAsRead$ = of(null).pipe(
      tap(() => notifications.forEach((n) => n.markAsRead()))
    );

    return markAllNotificationsAsRead$.pipe(
      switchMap(() => forkJoin(readNotificationsApiCalls$))
    );
  }

  private _goToTaskPage<T extends NotificationType>(
    notification: Notification<T>
  ) {
    const projectIdName: ProjectIdName = {
      Id: notification.project.id,
      Name: notification.project.name,
    };
    const route = buildTaskPageRoute(
      { Id: notification.task.id },
      projectIdName
    );

    return this.router.navigate(route);
  }
}
