import { NotificationId, ProjectIdName, TaskId } from './ids';

export type CommentAuthor = {
  name: string;
  id: string;
};
export interface NewCommentNotification {
  taskId: TaskId;
  project: ProjectIdName;
  comment: string;
  author: CommentAuthor;
  id: NotificationId;
}
