import { ProjectIdName } from '../../domain/models';

export type TaskAssignationNotificationPersistence = {
  id: string;
  taskId: string;
  project: ProjectIdName;
  assigneeId: string;
  read: boolean;
};
