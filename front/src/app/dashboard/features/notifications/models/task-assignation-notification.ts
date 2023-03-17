import { NotificationType, Notification } from './notification';

export type TaskAssignationNotification =
  Notification<NotificationType.ASSIGNATION> & {
    assigneeId: string;
    assignerId: string;
  };
