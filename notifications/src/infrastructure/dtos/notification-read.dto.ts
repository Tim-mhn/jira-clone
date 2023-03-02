import { CommentNotificationId, TaskFollowerId } from '../../domain/models';

export type NotificationReadDTO = {
  notificationId: CommentNotificationId;
  followerId: TaskFollowerId;
};
