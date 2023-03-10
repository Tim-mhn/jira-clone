import { TaskAssignationNotificationData } from '../models/task-assignation-notification';

export interface TaskAssignationNotificationRepository {
  create(data: Omit<TaskAssignationNotificationData, 'id'>): Promise<void>;
  markNotificationAsRead(notificationId: string): Promise<void>;
}
