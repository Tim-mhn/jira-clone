import { Injectable, Scope } from '@nestjs/common';
import { TaskFollowerId } from '../../../domain/models';
import {
  CommentNotificationId,
  NewCommentNotification,
} from '../../../domain/models/new-comment-notification';
import { NewCommentNotificationPersistence } from '../../persistence/new-comment-notification.persistence';
import { TaskFollowersRepository } from '../task-followers-repository/task-followers.repository';
import { PersistenceStorage } from '../../persistence/persistence.storage';
import { JSONFileStorage } from '../../storage/json-file.storage';

const NOTIFICATIONS_FILENAME =
  './src/infrastructure/persistence/new-comment-notifications.json';

const NotificationsJSONFileStorage: PersistenceStorage<
  NewCommentNotificationPersistence[]
> = new JSONFileStorage(NOTIFICATIONS_FILENAME);

@Injectable({ scope: Scope.DEFAULT })
export class CommentNotificationRepository {
  constructor(private followersRepo: TaskFollowersRepository) {}

  private storage = NotificationsJSONFileStorage;

  async getNewCommentNotifications(
    userId: TaskFollowerId,
  ): Promise<NewCommentNotification[]> {
    const tasksFollowedByUser = await this.followersRepo.getTasksFollowedByUser(
      userId,
    );

    const allNotifs = await this._getAllCommentNotifications();
    return allNotifs.filter((notif) => {
      const userFollowsTask = tasksFollowedByUser.includes(notif.taskId);
      if (!userFollowsTask) return false;

      const userHasNotReadNotif = !notif.readBy.includes(userId);
      return userHasNotReadNotif;
    });
  }

  async createNewCommentNotification(
    newCommentNotification: Omit<NewCommentNotification, 'id'>,
  ) {
    const noReads = [];

    const id = this._generateId();

    const allNotifs = await this._getAllCommentNotifications();

    const newNotif = {
      id,
      ...newCommentNotification,
      readBy: noReads,
    };

    allNotifs.push(newNotif);

    await this._updateCommentNotifications(allNotifs);
  }

  async markNotificationAsReadByUser(notificationAndFollowerIds: {
    notificationId: CommentNotificationId;
    followerId: TaskFollowerId;
  }) {
    const { followerId, notificationId } = notificationAndFollowerIds;
    const allNotifs = await this._getAllCommentNotifications();
    const notification = allNotifs.find((n) => n.id === notificationId);

    const newReads = Array.from(new Set([...notification.readBy, followerId]));
    notification.readBy = newReads;

    await this._updateCommentNotifications(allNotifs);
  }

  private _generateId() {
    return (Math.random() + 1).toString(36).substring(15);
  }

  private async _getAllCommentNotifications() {
    return this.storage.get();
  }

  private async _updateCommentNotifications(
    notifs: NewCommentNotificationPersistence[],
  ) {
    this.storage.set(notifs);
  }
}
