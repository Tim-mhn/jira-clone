import { Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { NotificationsController } from '../../controllers/notifications.controller';
import { NewNotifications, Notification, NotificationType } from '../../models';

@Component({
  selector: 'jira-notifications-indicator',
  templateUrl: './notifications-indicator.component.html',
})
export class NotificationsIndicatorComponent implements OnInit {
  constructor(private controller: NotificationsController) {}

  notifications$: Observable<NewNotifications>;

  CommentNotification = NotificationType.COMMENT;

  ngOnInit(): void {
    this.notifications$ = this.controller
      .getNewNotificationsForCurrentUser()
      .pipe(tap(console.log));
  }

  navigateToTaskPage(notification: Notification<any>) {
    this.controller.goToTaskPageAndMarkNotificationAsRead(notification);
  }
}
