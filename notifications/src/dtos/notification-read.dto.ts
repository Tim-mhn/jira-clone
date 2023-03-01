import { CommentNotificationId, TaskFollowerId } from '../models';

export type NotificationReadDTO = {
  notificationId: CommentNotificationId;
  followerId: TaskFollowerId;
};
