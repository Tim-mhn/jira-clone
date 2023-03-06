import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationsController } from '../../controllers/notifications.controller';
import { NewCommentNotification } from '../../models/new-comment-notification';

@Component({
  selector: 'jira-notifications-indicator',
  templateUrl: './notifications-indicator.component.html',
})
export class NotificationsIndicatorComponent implements OnInit {
  constructor(private controller: NotificationsController) {}

  notifications$: Observable<NewCommentNotification[]>;

  ngOnInit(): void {
    this.notifications$ = this.controller.getNewNotificationsForCurrentUser();
  }

  navigateToTaskPage(notification: NewCommentNotification) {
    this.controller.goToTaskPageAndMarkNotificationAsRead(notification);
  }
}
