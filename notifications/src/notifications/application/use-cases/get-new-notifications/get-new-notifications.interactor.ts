import { Inject, Injectable } from '@nestjs/common';
import { AllNotifications } from '../../../domain/models/all-notifications';
import { TaskAssignationNotificationRepository } from '../../../domain/repositories/assignation-notification.repository';
import { CommentNotificationsRepository } from '../../../domain/repositories/comment-notification.repository';
import { TaskAssignationNotificationRepositoryToken } from '../../../infrastructure/providers';
import { CommentNotificationsRepositoryToken } from '../../../infrastructure/providers/comment-notification-repository.provider';

@Injectable()
export class GetNewNotificationsInteractor {
  constructor(
    @Inject(CommentNotificationsRepositoryToken)
    private commentNotificationsRepo: CommentNotificationsRepository,
    @Inject(TaskAssignationNotificationRepositoryToken)
    private assignationNotificationsRepo: TaskAssignationNotificationRepository,
  ) {}

  async getNewNotifications(userId: string): Promise<AllNotifications> {
    const newCommentNotifications =
      this.commentNotificationsRepo.getNewCommentNotifications(userId);
    const taskAssignedNotifications =
      this.assignationNotificationsRepo.getNewNotifications(userId);

    const newNotifications = await Promise.all([
      newCommentNotifications,
      taskAssignedNotifications,
    ]);

    return newNotifications.flat();
  }
}
