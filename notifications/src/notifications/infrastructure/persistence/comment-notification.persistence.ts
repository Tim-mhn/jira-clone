import { NewCommentNotification } from '../../domain';

export type CommentNotificationPersistence = Omit<
  NewCommentNotification,
  'type'
>;
