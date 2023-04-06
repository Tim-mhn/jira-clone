import { Inject, Injectable } from '@nestjs/common';
import { NewCommentEvent } from '../../../domain/events/new-comment.event';
import {
  CommentNotificationsRepository,
  CommentNotificationsInput,
  TaskFollowersRepository,
  CreateCommentNotificationsOutput,
} from '../../../domain/repositories';
import { CommentNotificationsRepositoryToken } from '../../../adapter/providers/comment-notification-repository.provider';
import { TaskFollowersRepositoryToken } from '../../../adapter/providers/task-followers-repository.provider';
import { NewNotificationEmitter } from '../../emitters/new-notification.emitter';
import { CommentNotification } from '../../../domain';

@Injectable()
export class CreateCommentNotificationsInteractor {
  constructor(
    @Inject(TaskFollowersRepositoryToken)
    private taskFollowersRepo: TaskFollowersRepository,
    @Inject(CommentNotificationsRepositoryToken)
    private commentNotificationsRepo: CommentNotificationsRepository,
    private newNotificationEmitter: NewNotificationEmitter,
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

    const notificationWithFollowerIds =
      await this.commentNotificationsRepo.createCommentNotifications(input);

    this._emitCommentNotificationsEvents(input, notificationWithFollowerIds);
  }

  private _emitCommentNotificationsEvents(
    commentNotificationsInput: CommentNotificationsInput,
    notificationsIdFollowerId: CreateCommentNotificationsOutput,
  ) {
    const { author, comment, project, task } = commentNotificationsInput;
    const commentNotifications: CommentNotification[] =
      notificationsIdFollowerId?.map(({ notificationId, followerId }) => {
        return new CommentNotification({
          author,
          comment,
          followerId,
          id: notificationId,
          project,
          task,
        });
      });

    commentNotifications?.forEach((commentNotif) =>
      this.newNotificationEmitter.fireNewNotificationEvent(commentNotif),
    );
  }
}
