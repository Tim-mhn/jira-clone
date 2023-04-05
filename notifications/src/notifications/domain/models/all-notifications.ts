import { CommentNotification } from './new-comment-notification';
import { TaskAssignationNotification } from './task-assignation-notification';

export type AnyNotification = CommentNotification | TaskAssignationNotification;
export type AllNotifications = AnyNotification[];
