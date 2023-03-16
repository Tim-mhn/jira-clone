import { Provider } from '@nestjs/common';
import { DBTaskAssignationNotificationsRepository } from '../repositories/task-assignation-notifications/task-assignation-notifications.repository';

export const TaskAssignationNotificationsRepositoryToken =
  'TaskAssignationNotificationsRepositoryToken';

export const TaskAssignationNotificationsRepositoryProvider: Provider = {
  provide: TaskAssignationNotificationsRepositoryToken,
  useClass: DBTaskAssignationNotificationsRepository,
};
