import { NewCommentEvent } from '../events/new-comment.event';
import { CommentNotification, NotificationId, TaskFollowerId } from '../models';

export type CommentNotificationsInput = NewCommentEvent & {
  followersIds: string[];
};
export interface CommentNotificationsRepository {
  getCommentNotifications(
    userId: TaskFollowerId,
  ): Promise<CommentNotification[]>;
  createCommentNotifications(
    newCommentNotification: CommentNotificationsInput,
  ): Promise<void>;
  readNotification(notificationId: NotificationId): Promise<void>;
}
