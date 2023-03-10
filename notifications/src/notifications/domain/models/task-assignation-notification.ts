import { NotificationId, ProjectIdName } from './ids';

export interface TaskAssignationNotificationData {
  taskId: string;
  project: ProjectIdName;
  assigneeId: string;
}
export type TaskAssignationNotification = TaskAssignationNotificationData & {
  id: NotificationId;
};
