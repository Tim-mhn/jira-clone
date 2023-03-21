import { ProjectIdName } from './ids';
import { Notification, NotificationType } from './notification';
import { Task } from './task';

export interface TaskAssignationNotificationData {
  task: Task;
  project: ProjectIdName;
  assigneeId: string;
}
export class TaskAssignationNotification
  implements
    Notification<NotificationType.ASSIGNATION>,
    TaskAssignationNotificationData
{
  task: Task;
  project: ProjectIdName;
  assigneeId: string; // todo: do we need this ?
  id: string;
  type: NotificationType.ASSIGNATION;
}
