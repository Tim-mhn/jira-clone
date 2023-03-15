import { Author, CommentNotification, TaskProject } from '@prisma/client';

export type CommentNotificationPersistence = CommentNotification & {
  author: Author;
  project: TaskProject;
};
