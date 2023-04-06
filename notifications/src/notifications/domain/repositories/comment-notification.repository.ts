import { NewCommentEvent } from '../events/new-comment.event';
import { CommentNotification, NotificationId, TaskFollowerId } from '../models';

export type CommentNotificationsInput = NewCommentEvent & {
  followersIds: string[];
};

export type CreateCommentNotificationsOutput = {
  notificationId: string;
  followerId: string;
}[];
export interface CommentNotificationsRepository {
  getCommentNotifications(
    userId: TaskFollowerId,
  ): Promise<CommentNotification[]>;
  createCommentNotifications(
    newCommentNotification: CommentNotificationsInput,
  ): Promise<CreateCommentNotificationsOutput>;
  readNotification(notificationId: NotificationId): Promise<void>;
}
