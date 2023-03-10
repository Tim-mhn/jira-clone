import { NewCommentNotification, TaskFollowerId } from '../../domain/models';

export type NewCommentNotificationPersistence = NewCommentNotification & {
  readBy: TaskFollowerId[];
};
