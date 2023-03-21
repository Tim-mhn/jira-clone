import { CommentNotification } from './new-comment-notification';
import { TaskAssignationNotification } from './task-assignation-notification';

export type AllNotifications = (
  | CommentNotification
  | TaskAssignationNotification
)[];
