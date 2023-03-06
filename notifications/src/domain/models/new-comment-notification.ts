import { ProjectIdName, TaskId } from './ids';

export type CommentNotificationId = string;

export type CommentAuthor = {
  name: string;
  id: string;
};
export type NewCommentNotification = {
  taskId: TaskId;
  project: ProjectIdName;
  comment: string;
  author: CommentAuthor;
  id: CommentNotificationId;
};
