import { Inject, Injectable } from '@nestjs/common';
import { NewCommentEvent } from '../../../domain/events/new-comment.event';
import {
  CommentNotificationsRepository,
  NewCommentNotificationsInput,
  TaskFollowersRepository,
} from '../../../domain/repositories';
import { CommentNotificationsRepositoryToken } from '../../../infrastructure/providers/comment-notification-repository.provider';
import { TaskFollowersRepositoryToken } from '../../../infrastructure/providers/task-followers-repository.provider';

@Injectable()
export class CreateCommentNotificationsInteractor {
  constructor(
    @Inject(TaskFollowersRepositoryToken)
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

    const noFollowers = followersIdsExceptAuthor.length === 0;
    if (noFollowers) return;

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
