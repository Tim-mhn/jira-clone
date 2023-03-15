import { Provider } from '@nestjs/common';
import { JSONTaskAssignationNotificationsRepository } from '../repositories/assignation-notification-repository/assignation-notification.repository';

export const TaskAssignationNotificationsRepositoryToken =
  'TaskAssignationNotificationsRepositoryToken';

export const TaskAssignationNotificationsRepositoryProvider: Provider = {
  provide: TaskAssignationNotificationsRepositoryToken,
  useClass: JSONTaskAssignationNotificationsRepository,
};
