import { TaskAssignationNotificationData } from '../models';

export type TaskAssignedEvent = TaskAssignationNotificationData & {
  assignedById: string;
};
