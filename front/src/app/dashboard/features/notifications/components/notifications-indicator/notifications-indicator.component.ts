import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectIdName } from '../../../../core/models';
import { buildTaskPageRoute } from '../../../browse/utils/build-browse-page-routes.util';
import { NotificationsAPI } from '../../apis/notifications.api';
import { NewCommentNotification } from '../../models/new-comment-notification';

@Component({
  selector: 'jira-notifications-indicator',
  templateUrl: './notifications-indicator.component.html',
})
export class NotificationsIndicatorComponent implements OnInit {
  constructor(private api: NotificationsAPI, private router: Router) {}

  notifications$: Observable<NewCommentNotification[]>;

  ngOnInit(): void {
    this.notifications$ = this.api.getNewCommentNotifications();
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
