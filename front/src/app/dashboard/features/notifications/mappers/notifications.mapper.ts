import { Injectable } from '@angular/core';
import { Mapper } from '../../../../shared/mappers';
import {
  NewNotificationsDTO,
  CommentNotificationDTO,
  TaskAssignationNotificationDTO,
} from '../dtos/new-notifications.dto';
import {
  CommentNotification,
  TaskAssignationNotification,
  NewNotifications,
  NotificationType,
} from '../models';
import { NotificationsProvidersModule } from '../notifications-providers.module';
import { logMethod } from '../../../../shared/utils/log-method.decorator';

@Injectable({
  providedIn: NotificationsProvidersModule,
})
export class NotificationsMapper
  implements Mapper<NewNotifications, NewNotificationsDTO>
{
  @logMethod
  buildNotificationFromDTO(
    dto: CommentNotificationDTO | TaskAssignationNotificationDTO
  ): TaskAssignationNotification | CommentNotification {
    switch (dto.type) {
      case NotificationType.COMMENT:
        return new CommentNotification(dto);

      case NotificationType.ASSIGNATION:
        return new TaskAssignationNotification(dto);

      default:
        throw new Error(
          `[NotificationsMapper] could not create Notification object for notification dto with missing type`
        );
    }
  }
  toDomain(dto: NewNotificationsDTO): NewNotifications {
    return dto.map((notifDTO) => this.buildNotificationFromDTO(notifDTO));
  }
}
