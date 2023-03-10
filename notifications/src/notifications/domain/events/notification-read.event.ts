import { NotificationId, TaskFollowerId } from '../models';

export interface NotificationReadEvent {
  notificationId: NotificationId;
  followerId: TaskFollowerId;
}
