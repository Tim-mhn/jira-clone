import {
  CommentNotificationData,
  TaskAssignationNotificationData,
} from '../models';

export type CommentNotificationDTO = CommentNotificationData;

export type TaskAssignationNotificationDTO = TaskAssignationNotificationData;

export type NewNotificationsDTO = (
  | CommentNotificationDTO
  | TaskAssignationNotificationDTO
)[];
