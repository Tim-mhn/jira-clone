import { Notification, NotificationType } from './notification';

export type CommentNotification = Notification<NotificationType.ASSIGNATION> & {
  comment: string;
  author: {
    name: string;
    id: string;
  };
};
