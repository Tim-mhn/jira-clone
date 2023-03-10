import { NewCommentNotification, TaskFollowerId } from '../../domain/models';

export type NewCommentNotificationPersistence = Omit<
  NewCommentNotification,
  'type'
> & {
  readBy: TaskFollowerId[];
};
