import { NewCommentNotification, TaskFollowerId } from '../models';

export type NewCommentNotificationPersistence = NewCommentNotification & {
  readBy: Set<TaskFollowerId>;
};
