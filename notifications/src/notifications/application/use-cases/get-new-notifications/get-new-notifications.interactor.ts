import { Inject, Injectable } from '@nestjs/common';
import { AllNotifications } from '../../../domain/models/all-notifications';
import { TaskAssignationNotificationsRepository } from '../../../domain/repositories/assignation-notification.repository';
import { CommentNotificationsRepository } from '../../../domain/repositories/comment-notification.repository';
import { TaskAssignationNotificationsRepositoryToken } from '../../../infrastructure/providers';
import { CommentNotificationsRepositoryToken } from '../../../infrastructure/providers/comment-notification-repository.provider';

@Injectable()
export class GetNewNotificationsInteractor {
  constructor(
    @Inject(CommentNotificationsRepositoryToken)
    private commentNotificationsRepo: CommentNotificationsRepository,
    @Inject(TaskAssignationNotificationsRepositoryToken)
    private assignationNotificationsRepo: TaskAssignationNotificationsRepository,
  ) {}

  async getUserNewCommentNotifications(
    userId: string,
  ): Promise<AllNotifications> {
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
