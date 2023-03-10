import { TaskAssignationNotificationData } from '../models';

export type TaskAssignedEvent = TaskAssignationNotificationData & {
  assignerId: string;
};
