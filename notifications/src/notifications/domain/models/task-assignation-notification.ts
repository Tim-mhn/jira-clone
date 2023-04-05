import { User } from '../../../auth';
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
  constructor(data: TaskAssignationNotificationData & { id: string }) {
    this.task = data.task;
    this.project = data.project;
    this.id = data.id;
    this.assigneeId = data.assigneeId;
  }
  task: Task;
  project: ProjectIdName;
  assigneeId: string;
  id: string;
  readonly type = NotificationType.ASSIGNATION;

  isForUser(user: User) {
    return this.assigneeId === user.Id;
  }
}
