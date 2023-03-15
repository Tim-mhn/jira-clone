import { Inject, Injectable } from '@nestjs/common';
import { NotificationReadEvent } from '../../../domain';
import { NotificationType } from '../../../domain/models/notification';
import { TaskAssignationNotificationsRepository } from '../../../domain/repositories/assignation-notification.repository';
import { CommentNotificationsRepository } from '../../../domain/repositories/comment-notification.repository';
import { TaskAssignationNotificationsRepositoryToken } from '../../../infrastructure/providers';
import { CommentNotificationsRepositoryToken } from '../../../infrastructure/providers/comment-notification-repository.provider';

@Injectable()
export class ReadNotificationInteractor {
  constructor(
    @Inject(CommentNotificationsRepositoryToken)
    private commentNotificationsRepo: CommentNotificationsRepository,
    @Inject(TaskAssignationNotificationsRepositoryToken)
    private assignationNotificationRepo: TaskAssignationNotificationsRepository,
  ) {}

  async readNotification(readNotificationEvent: NotificationReadEvent) {
    const { notificationId, notificationType } = readNotificationEvent;
    if (notificationType === NotificationType.COMMENT) {
      await this.commentNotificationsRepo.readNotification(notificationId);
      return;
    }

    await this.assignationNotificationRepo.readNotification(notificationId);
  }
}
