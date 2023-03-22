import { Injectable } from '@angular/core';
import { Mapper } from '../../../../shared/mappers';
import { NewNotificationsDTO } from '../dtos/new-notifications.dto';
import {
  CommentNotification,
  TaskAssignationNotification,
  NewNotifications,
  NotificationType,
} from '../models';
import { NotificationsProvidersModule } from '../notifications-providers.module';

@Injectable({
  providedIn: NotificationsProvidersModule,
})
export class NotificationsMapper
  implements Mapper<NewNotifications, NewNotificationsDTO>
{
  toDomain(dto: NewNotificationsDTO): NewNotifications {
    return dto.map((notifDTO) => {
      switch (notifDTO.type) {
        case NotificationType.COMMENT:
          return new CommentNotification(notifDTO);

        case NotificationType.ASSIGNATION:
          return new TaskAssignationNotification(notifDTO);

        default:
          throw new Error(
            `[NotificationsMapper] could not create Notification object for notification dto with missing type`
          );
      }
    });
  }
}
