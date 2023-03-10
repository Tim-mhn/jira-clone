import { IsNotEmpty } from 'class-validator';

export class ReadNotificationDTO {
  @IsNotEmpty()
  notificationId: string;
}
