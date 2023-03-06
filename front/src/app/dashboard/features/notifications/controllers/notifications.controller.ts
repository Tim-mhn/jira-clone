import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectIdName } from '../../../core/models';
import { buildTaskPageRoute } from '../../browse/utils/build-browse-page-routes.util';
import { NotificationsAPI } from '../apis/notifications.api';
import { NewCommentNotification } from '../models/new-comment-notification';
import { NotificationsProvidersModule } from '../notifications-providers.module';

@Injectable({
  providedIn: NotificationsProvidersModule,
})
export class NotificationsController {
  constructor(private api: NotificationsAPI, private router: Router) {}

  public getNewNotificationsForCurrentUser() {
    return this.api.getNewCommentNotifications();
  }

  public goToTaskPageAndMarkNotificationAsRead(
    notification: NewCommentNotification
  ) {
    this.api.readNotification({ notificationId: notification.id }).subscribe();
    this._goToTaskPage(notification);
  }

  private _goToTaskPage(notification: NewCommentNotification) {
    const projectIdName: ProjectIdName = {
      Id: notification.project.id,
      Name: notification.project.name,
    };
    const route = buildTaskPageRoute(
      { Id: notification.taskId },
      projectIdName
    );

    return this.router.navigate(route);
  }
}
