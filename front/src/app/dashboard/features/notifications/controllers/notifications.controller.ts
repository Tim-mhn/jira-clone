import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectIdName } from '../../../core/models';
import { buildTaskPageRoute } from '../../browse/utils/build-browse-page-routes.util';
import { NotificationsAPI } from '../apis/notifications.api';
import { Notification, NotificationType } from '../models';
import { NotificationsProvidersModule } from '../notifications-providers.module';

@Injectable({
  providedIn: NotificationsProvidersModule,
})
export class NotificationsController {
  constructor(private api: NotificationsAPI, private router: Router) {}

  public getNewNotificationsForCurrentUser() {
    return this.api.getNewNotifications();
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
