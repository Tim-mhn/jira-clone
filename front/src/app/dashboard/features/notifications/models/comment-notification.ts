import {
  Notification,
  NotificationData,
  NotificationType,
} from './notification';

export type CommentAuthor = {
  name: string;
  id: string;
};

export type CommentNotificationData =
  NotificationData<NotificationType.COMMENT> & {
    comment: string;
    author: CommentAuthor;
  };

export class CommentNotification
  extends Notification<NotificationType.COMMENT>
  implements CommentNotificationData
{
  comment: string;
  author: CommentAuthor;

  constructor(data: CommentNotificationData) {
    super(data);
    this.comment = data.comment;
    this.author = data.author;
  }
}
