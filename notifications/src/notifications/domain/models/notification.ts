import { User } from '../../../auth';
import { NotificationId } from './ids';

export enum NotificationType {
  COMMENT = 'comment',
  ASSIGNATION = 'assignation',
}

export interface Notification<T extends NotificationType> {
  id: NotificationId;
  type: T;

  isForUser(user: User): boolean;
}
