import { Injectable, Scope } from '@nestjs/common';
import { TaskFollowerId } from '../../models';
import {
  CommentNotificationId,
  NewCommentNotification,
} from '../../models/new-comment-notification';
import { NewCommentNotificationPersistence } from '../../persistence/new-comment-notification.persistence';
import { TaskFollowersRepository } from '../task-followers-repository/task-followers.repository';

const dummyCommentNotif: NewCommentNotification = {
  author: {
    id: 'aceace',
    name: 'Bob',
  },
  comment: 'comment',
  project: {
    id: '75a4ca83-2f38-47c5-96f0-20838d93a368',
    name: 'project',
  },
  taskId: '1',
  id: 'ceacaeceaceac',
};

const _TimFollowerID = '9b027c7e-33b7-4ceb-a3b7-99bcc2f7cb89';

@Injectable({ scope: Scope.DEFAULT })
export class CommentNotificationRepository {
  private ALL_NEW_COMMENT_NOTIFICATIONS: NewCommentNotificationPersistence[] = [
    {
      ...dummyCommentNotif,
      readBy: new Set<TaskFollowerId>(),
    },
  ];

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

  createNewCommentNotification(newCommentNotification: NewCommentNotification) {
    const noReads = new Set<TaskFollowerId>();
    this.ALL_NEW_COMMENT_NOTIFICATIONS.push({
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
}
