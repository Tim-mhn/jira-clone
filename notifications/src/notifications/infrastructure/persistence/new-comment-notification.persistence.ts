import { Author, CommentNotification, TaskProject } from '@prisma/client';
import { NewCommentNotification } from '../../domain/models';

export type CommentNotificationPersistence = Omit<
  NewCommentNotification,
  'type'
> & {
  read: boolean;
  followerId: string;
};

// todo : drop "2" when  CommentNotificationPersistence is not used anymore
export type CommentNotificationPersistence2 = CommentNotification & {
  author: Author;
  project: TaskProject;
};
