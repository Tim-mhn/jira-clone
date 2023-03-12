import { NewCommentNotification } from '../../domain/models';

export type NewCommentNotificationPersistence = Omit<
  NewCommentNotification,
  'type'
> & {
  read: boolean;
  followerId: string;
};
