import { IsNotEmpty } from 'class-validator';
import { ProjectIdName } from '../../domain';
import { TaskAssignationNotificationData } from '../../domain/models/task-assignation-notification';
import { NotificationTaskDTO } from './notification-task.dto';

export class AssignationNotificationDTO
  implements TaskAssignationNotificationData
{
  @IsNotEmpty()
  task: NotificationTaskDTO;

  @IsNotEmpty()
  project: ProjectIdName;

  @IsNotEmpty()
  assigneeId: string;
}
