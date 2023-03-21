import { IsNotEmpty } from 'class-validator';
import { Task } from '../../domain';

export class NotificationTaskDTO implements Task {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;
}
