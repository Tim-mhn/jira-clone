import { CommentNotification } from './comment-notification';
import { TaskAssignationNotification } from './task-assignation-notification';

export type NewNotifications = (
  | TaskAssignationNotification
  | CommentNotification
)[];
