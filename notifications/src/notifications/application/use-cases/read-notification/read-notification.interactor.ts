import { Inject, Injectable } from '@nestjs/common';
import { NotificationReadEvent } from '../../../domain';
import { NotificationType } from '../../../domain/models/notification';
import { TaskAssignationNotificationRepository } from '../../../domain/repositories/assignation-notification.repository';
import { CommentNotificationRepository } from '../../../domain/repositories/comment-notification.repository';
import { TaskAssignationNotificationRepositoryToken } from '../../../infrastructure/providers';
import { CommentNotificationRepositoryToken } from '../../../infrastructure/providers/comment-notification-repository.provider';

@Injectable()
export class ReadNotificationInteractor {
  constructor(
    @Inject(CommentNotificationRepositoryToken)
    private commentNotificationsRepo: CommentNotificationRepository,
    @Inject(TaskAssignationNotificationRepositoryToken)
    private assignationNotificationRepo: TaskAssignationNotificationRepository,
  ) {}

  async readNotification(readNotificationEvent: NotificationReadEvent) {
    if (readNotificationEvent.notificationType === NotificationType.COMMENT) {
      await this.commentNotificationsRepo.markNotificationAsReadByUser(
        readNotificationEvent,
      );
      return;
    }

    await this.assignationNotificationRepo.markNotificationAsRead(
      readNotificationEvent.notificationId,
    );
  }
}
