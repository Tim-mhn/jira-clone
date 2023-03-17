import { IsNotEmpty } from 'class-validator';
import { ProjectIdName } from '../../domain';
import { TaskAssignationNotificationData } from '../../domain/models/task-assignation-notification';

export class AssignationNotificationDTO
  implements TaskAssignationNotificationData
{
  @IsNotEmpty()
  project: ProjectIdName;

  @IsNotEmpty()
  assigneeId: string;

  @IsNotEmpty()
  taskId: string;
}
