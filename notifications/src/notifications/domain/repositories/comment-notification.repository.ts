import { NewCommentEvent } from '../events/new-comment.event';
import {
  NewCommentNotification,
  NotificationId,
  TaskFollowerId,
} from '../models';

export type NewCommentNotificationsInput = NewCommentEvent & {
  followersIds: string[];
};
export interface CommentNotificationsRepository {
  getNewCommentNotifications(
    userId: TaskFollowerId,
  ): Promise<NewCommentNotification[]>;
  createNewCommentNotifications(
    newCommentNotification: NewCommentNotificationsInput,
  ): Promise<void>;
  readNotification(notificationId: NotificationId): Promise<void>;
}
