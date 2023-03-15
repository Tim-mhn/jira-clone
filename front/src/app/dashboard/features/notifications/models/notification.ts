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

export interface Notification<T extends NotificationType> {
  id: NotificationId;
  type: T;
  taskId: string;
  project: NotificationProject;
}