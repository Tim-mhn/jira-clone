import { NotificationId } from '../models';
import { NotificationType } from '../models/notification';

export interface NotificationReadEvent {
  notificationId: NotificationId;
  notificationType: NotificationType;
}
