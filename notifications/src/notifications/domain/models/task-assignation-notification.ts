import { ProjectIdName } from './ids';
import { Notification, NotificationType } from './notification';

export interface TaskAssignationNotificationData {
  taskId: string;
  project: ProjectIdName;
  assigneeId: string;
}
export class TaskAssignationNotification
  implements
    Notification<NotificationType.ASSIGNATION>,
    TaskAssignationNotificationData
{
  taskId: string;
  project: ProjectIdName;
  assigneeId: string; // todo: do we need this ?
  id: string;
  type: NotificationType.ASSIGNATION;
}
