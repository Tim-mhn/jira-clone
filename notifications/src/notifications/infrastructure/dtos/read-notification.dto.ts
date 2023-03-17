import { IsNotEmpty } from 'class-validator';
import { NotificationId } from '../../domain';
import { NotificationType } from '../../domain/models/notification';

export class ReadNotificationDTO {
  @IsNotEmpty()
  id: NotificationId;

  @IsNotEmpty()
  type: NotificationType;
}
