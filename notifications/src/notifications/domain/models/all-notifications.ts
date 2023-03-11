import { NewCommentNotification } from './new-comment-notification';
import { TaskAssignationNotification } from './task-assignation-notification';

export type AllNotifications = (
  | NewCommentNotification
  | TaskAssignationNotification
)[];
