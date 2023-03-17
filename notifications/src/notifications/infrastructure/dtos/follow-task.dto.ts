import { IsNotEmpty } from 'class-validator';
export class FollowTaskDTO {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  taskId: string;
}
