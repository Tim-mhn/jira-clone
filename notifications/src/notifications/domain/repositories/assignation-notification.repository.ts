import {
  TaskAssignationNotification,
  TaskAssignationNotificationData,
} from '../models/task-assignation-notification';

export interface TaskAssignationNotificationRepository {
  create(data: Omit<TaskAssignationNotificationData, 'id'>): Promise<void>;
  readNotification(notificationId: string): Promise<void>;
  getNewNotifications(userId: string): Promise<TaskAssignationNotification[]>;
}
