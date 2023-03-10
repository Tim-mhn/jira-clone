import { ProjectIdName, TaskId } from './ids';
import { Notification, NotificationType } from './notification';

export type CommentAuthor = {
  name: string;
  id: string;
};
export class NewCommentNotification
  implements Notification<NotificationType.COMMENT>
{
  id: string;
  type: NotificationType.COMMENT;
  taskId: TaskId;
  project: ProjectIdName;
  comment: string;
  author: CommentAuthor;
}
