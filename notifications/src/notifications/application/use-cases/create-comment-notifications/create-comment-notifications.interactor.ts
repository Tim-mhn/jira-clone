import { Inject, Injectable } from '@nestjs/common';
import { NewCommentEvent } from '../../../domain/events/new-comment.event';
import {
  CommentNotificationsRepository,
  NewCommentNotificationsInput,
} from '../../../domain/repositories/comment-notification.repository';
import { CommentNotificationsRepositoryToken } from '../../../infrastructure/providers/comment-notification-repository.provider';
import { TaskFollowersRepository } from '../../../infrastructure/repositories/task-followers-repository/task-followers.repository';

@Injectable()
export class CreateCommentNotificationsInteractor {
  constructor(
    private taskFollowersRepo: TaskFollowersRepository,
    @Inject(CommentNotificationsRepositoryToken)
    private commentNotificationsRepo: CommentNotificationsRepository,
  ) {}

  async createNotificationsForTaskFollowersExceptCommentAuthor(
    newCommentEvent: NewCommentEvent,
  ) {
    const { author, comment, project, taskId } = newCommentEvent;
    const followersIds = await this.taskFollowersRepo.getTaskFollowersIds(
      taskId,
    );
    const followersIdsExceptAuthor = followersIds.filter(
      (id) => id !== author.id,
    );

    const input: NewCommentNotificationsInput = {
      author,
      comment,
      project,
      taskId,
      followersIds: followersIdsExceptAuthor,
    };

    await this.commentNotificationsRepo.createNewCommentNotifications(input);
  }
}
