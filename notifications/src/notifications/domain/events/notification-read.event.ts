import { NotificationId, TaskFollowerId } from '../models';
import { NotificationType } from '../models/notification';

export interface NotificationReadEvent {
  notificationId: NotificationId;
  followerId: TaskFollowerId;
  notificationType: NotificationType;
}
