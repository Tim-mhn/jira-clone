import { Task } from '../events/new-comment.event';
import { ProjectIdName } from './ids';
import { Notification, NotificationType } from './notification';

export type CommentAuthor = {
  name: string;
  id: string;
};
export class CommentNotification
  implements Notification<NotificationType.COMMENT>
{
  id: string;
  type: NotificationType.COMMENT;
  task: Task;
  project: ProjectIdName;
  comment: string;
  author: CommentAuthor;
}
