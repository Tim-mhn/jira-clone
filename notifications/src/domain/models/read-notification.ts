import { TaskFollowerId } from './ids';
import { CommentNotificationId } from './new-comment-notification';

export interface ReadNotification {
  notificationId: CommentNotificationId;
  followerId: TaskFollowerId;
}
