import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ICONS } from '@tim-mhn/common/icons';
import { Observable, shareReplay, tap } from 'rxjs';
import { NotificationsController } from '../../controllers/notifications.controller';
import { NewNotifications, Notification, NotificationType } from '../../models';

@Component({
  selector: 'jira-notifications-indicator',
  templateUrl: './notifications-indicator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsIndicatorComponent implements OnInit {
  readonly BELL_ICON = ICONS.BELL;

  constructor(
    private controller: NotificationsController,
    private cdr: ChangeDetectorRef
  ) {}

  notifications$: Observable<NewNotifications>;

  allNotifications: NewNotifications = [];

  CommentNotification = NotificationType.COMMENT;

  ngOnInit(): void {
    this.notifications$ = this.controller
      .getNewNotificationsForCurrentUser()
      .pipe(
        tap((notifs) => (this.allNotifications = notifs)),
        shareReplay()
      );
  }

  navigateToTaskPage(notification: Notification<any>) {
    this.controller.goToTaskPageAndMarkNotificationAsRead(notification);
  }

  markAllNotificationsAsRead() {
    this.controller
      .readAllNotifications(this.allNotifications)
      .subscribe(() => {
        // new reference to force pipe to re-run
        this.allNotifications = [...this.allNotifications];
        this.cdr.detectChanges();
      });
  }
}
