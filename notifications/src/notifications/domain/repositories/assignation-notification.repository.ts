import {
  TaskAssignationNotification,
  TaskAssignationNotificationData,
} from '../models/task-assignation-notification';

export interface TaskAssignationNotificationsRepository {
  create(data: Omit<TaskAssignationNotificationData, 'id'>): Promise<void>;
  readNotification(notificationId: string): Promise<void>;
  getNewNotifications(userId: string): Promise<TaskAssignationNotification[]>;
  dismissNotificationsFromTask(taskId: string): Promise<void>;
}
