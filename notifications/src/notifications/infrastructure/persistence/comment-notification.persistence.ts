import {
  Author,
  CommentNotification as DBCommentNotification,
  CommentNotificationData as DBCommentNotificationData,
  TaskProject,
} from '@prisma/client';
export type CommentNotificationPersistence = Pick<
  DBCommentNotification,
  'id' | 'followerId'
> & {
  data: Partial<DBCommentNotificationData> & {
    author: Omit<Author, 'uuid'>;
    project: Omit<TaskProject, 'uuid'>;
  };
};
