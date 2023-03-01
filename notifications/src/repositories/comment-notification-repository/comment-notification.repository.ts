import { Injectable, Scope } from '@nestjs/common';
import { TaskFollowerId } from '../../models';
import {
  CommentNotificationId,
  NewCommentNotification,
} from '../../models/new-comment-notification';
import { NewCommentNotificationPersistence } from '../../persistence/new-comment-notification.persistence';
import { TaskFollowersRepository } from '../task-followers-repository/task-followers.repository';

@Injectable({ scope: Scope.DEFAULT })
export class CommentNotificationRepository {
  private ALL_NEW_COMMENT_NOTIFICATIONS: NewCommentNotificationPersistence[] =
    [];

  constructor(private followersRepo: TaskFollowersRepository) {}

  getNewCommentNotifications(userId: TaskFollowerId): NewCommentNotification[] {
    const tasksFollowedByUser =
      this.followersRepo.getTasksFollowedByUser(userId);

    return this.ALL_NEW_COMMENT_NOTIFICATIONS.filter((notif) => {
      const userFollowsTask = tasksFollowedByUser.includes(notif.taskId);
      if (!userFollowsTask) return false;

      const userHasNotReadNotif = !notif.readBy.has(userId);
      return userHasNotReadNotif;
    });
  }

  createNewCommentNotification(
    newCommentNotification: Omit<NewCommentNotification, 'id'>,
  ) {
    const noReads = new Set<TaskFollowerId>();

    const id = this._generateId();
    this.ALL_NEW_COMMENT_NOTIFICATIONS.push({
      id,
      ...newCommentNotification,
      readBy: noReads,
    });
  }

  markNotificationAsReadByUser(notificationAndFollowerIds: {
    notificationId: CommentNotificationId;
    followerId: TaskFollowerId;
  }) {
    const { followerId, notificationId } = notificationAndFollowerIds;
    const notification = this.ALL_NEW_COMMENT_NOTIFICATIONS.find(
      (n) => n.id === notificationId,
    );
    notification.readBy.add(followerId);
  }

  private _generateId() {
    return (Math.random() + 1).toString(36).substring(15);
  }
}
