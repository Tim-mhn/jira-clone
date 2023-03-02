import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectIdName } from '../../../../core/models';
import { buildTaskPageRoute } from '../../../browse/utils/build-browse-page-routes.util';
import { NotificationsController } from '../../controllers/notifications.controller';
import { NewCommentNotification } from '../../models/new-comment-notification';

@Component({
  selector: 'jira-notifications-indicator',
  templateUrl: './notifications-indicator.component.html',
})
export class NotificationsIndicatorComponent implements OnInit {
  constructor(
    private controller: NotificationsController,
    private router: Router
  ) {}

  notifications$: Observable<NewCommentNotification[]>;

  ngOnInit(): void {
    this.notifications$ = this.controller.getNewNotificationsForCurrentUser();
  }

  navigateToTaskPage(notification: NewCommentNotification) {
    const projectIdName: ProjectIdName = {
      Id: notification.project.id,
      Name: notification.project.name,
    };
    const route = buildTaskPageRoute(
      { Id: notification.taskId },
      projectIdName
    );

    this.router.navigate(route);
  }
}
