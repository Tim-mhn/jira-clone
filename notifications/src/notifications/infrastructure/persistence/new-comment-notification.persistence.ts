import { NewCommentNotification } from '../../domain/models';

export type CommentNotificationPersistence = Omit<
  NewCommentNotification,
  'type'
> & {
  read: boolean;
  followerId: string;
};
