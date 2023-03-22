import {
  NotificationType,
  Notification,
  NotificationData,
} from './notification';

export type TaskAssignationNotificationData =
  NotificationData<NotificationType.ASSIGNATION> & {
    assigneeId: string;
  };

export class TaskAssignationNotification extends Notification<NotificationType.ASSIGNATION> {
  assigneeId: string;

  constructor(data: TaskAssignationNotificationData) {
    super(data);
    this.assigneeId = data.assigneeId;
  }
}
