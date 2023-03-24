// eslint-disable-next-line no-shadow
export enum NotificationType {
  COMMENT = 'comment',
  ASSIGNATION = 'assignation',
}

export type NotificationId = string;

export type NotificationProject = {
  id: string;
  name: string;
};

type NotificationTask = {
  id: string;
  title: string;
};
export interface NotificationData<T extends NotificationType> {
  id: NotificationId;
  type: T;
  task: NotificationTask;
  project: NotificationProject;
}

export class Notification<T extends NotificationType>
  implements NotificationData<T>
{
  id: NotificationId;
  type: T;
  task: NotificationTask;
  project: NotificationProject;
  read: boolean;

  constructor(data: NotificationData<T>) {
    this.id = data.id;
    this.type = data.type;
    this.task = data.task;
    this.project = data.project;
    this.read = false;
  }

  markAsRead() {
    this.read = true;
  }
}
