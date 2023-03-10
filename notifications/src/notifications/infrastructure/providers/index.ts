import { Provider } from '@nestjs/common';
import { JSONTaskAssignationNotificationRepository } from '../repositories/assignation-notification-repository/assignation-notification.repository';

export const TaskAssignationNotificationRepositoryToken =
  'TaskAssignationNotificationRepositoryToken';

export const TaskAssignationNotificationRepositoryProvider: Provider = {
  provide: TaskAssignationNotificationRepositoryToken,
  useClass: JSONTaskAssignationNotificationRepository,
};
