import { Inject, Injectable } from '@nestjs/common';
import { NewCommentEvent } from '../../../domain/events/new-comment.event';
import {
  CommentNotificationsRepository,
  CommentNotificationsInput,
  TaskFollowersRepository,
} from '../../../domain/repositories';
import { CommentNotificationsRepositoryToken } from '../../../adapter/providers/comment-notification-repository.provider';
import { TaskFollowersRepositoryToken } from '../../../adapter/providers/task-followers-repository.provider';

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
    const { author, comment, project, task } = newCommentEvent;
    const followersIds = await this.taskFollowersRepo.getTaskFollowersIds(
      task.id,
    );
    const followersIdsExceptAuthor = followersIds.filter(
      (id) => id !== author.id,
    );

    const noFollowers = followersIdsExceptAuthor.length === 0;
    if (noFollowers) return;

    const input: CommentNotificationsInput = {
      author,
      comment,
      project,
      task,
      followersIds: followersIdsExceptAuthor,
    };

    await this.commentNotificationsRepo.createCommentNotifications(input);
  }
}
