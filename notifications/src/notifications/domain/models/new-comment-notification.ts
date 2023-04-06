import { User } from '../../../auth';
import { ProjectIdName, TaskFollowerId } from './ids';
import { Notification, NotificationType } from './notification';
import { Task } from './task';

export type CommentAuthor = {
  name: string;
  id: string;
};

export interface CommentNotificationProps {
  id: string;
  task: Task;
  project: ProjectIdName;
  comment: string;
  author: CommentAuthor;
  followerId: TaskFollowerId;
}
export class CommentNotification
  implements Notification<NotificationType.COMMENT>
{
  constructor(props: CommentNotificationProps) {
    this.id = props.id;
    this.task = props.task;
    this.project = props.project;
    this.comment = props.comment;
    this.author = props.author;
    this.followerId = props.followerId;
  }
  id: string;
  readonly type = NotificationType.COMMENT;
  task: Task;
  project: ProjectIdName;
  comment: string;
  author: CommentAuthor;
  followerId: TaskFollowerId;

  isForUser(user: User): boolean {
    return this.followerId === user.Id;
  }
}
