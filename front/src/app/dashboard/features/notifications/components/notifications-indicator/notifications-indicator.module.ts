import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimUIDropdownMenuModule } from '@tim-mhn/ng-ui/dropdown-menu';
import { NotificationsIndicatorComponent } from './notifications-indicator.component';
import { CommentNotificationUiComponent } from './comment-notification-ui/comment-notification-ui.component';
import { TaskAssignationNotificationUiComponent } from './task-assignation-notification-ui/task-assignation-notification-ui.component';
import { NotificationWrapperComponent } from './notification-wrapper/notification-wrapper.component';
import { SomeUnreadNotificationsPipe } from '../../pipes/some-unread-notifications.pipe';

@NgModule({
  declarations: [
    NotificationsIndicatorComponent,
    CommentNotificationUiComponent,
    TaskAssignationNotificationUiComponent,
    NotificationWrapperComponent,
    SomeUnreadNotificationsPipe,
  ],
  imports: [CommonModule, TimUIDropdownMenuModule],
  exports: [NotificationsIndicatorComponent],
})
export class NotificationsIndicatorModule {}
