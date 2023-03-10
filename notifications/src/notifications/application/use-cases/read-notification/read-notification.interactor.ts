import { Inject, Injectable } from '@nestjs/common';
import { NotificationReadEvent } from '../../../domain';
import { NotificationType } from '../../../domain/models/notification';
import { TaskAssignationNotificationRepository } from '../../../domain/repositories/assignation-notification.repository';
import { TaskAssignationNotificationRepositoryToken } from '../../../infrastructure/providers';
import { CommentNotificationRepository } from '../../../infrastructure/repositories/comment-notification-repository/comment-notification.repository';

@Injectable()
export class ReadNotificationInteractor {
  constructor(
    private commentNotificationRepo: CommentNotificationRepository,
    @Inject(TaskAssignationNotificationRepositoryToken)
    private assignationNotificationRepo: TaskAssignationNotificationRepository,
  ) {}

  async readNotification(readNotificationEvent: NotificationReadEvent) {
    if (readNotificationEvent.notificationType === NotificationType.COMMENT) {
      await this.commentNotificationRepo.markNotificationAsReadByUser(
        readNotificationEvent,
      );
      return;
    }

    await this.assignationNotificationRepo.markNotificationAsRead(
      readNotificationEvent.notificationId,
    );
  }
}
