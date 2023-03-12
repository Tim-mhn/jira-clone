import { Injectable, Scope } from '@nestjs/common';
import { TaskFollowerId } from '../../../domain/models';
import { NewCommentNotification } from '../../../domain/models/new-comment-notification';
import { NewCommentNotificationPersistence } from '../../persistence/new-comment-notification.persistence';
import { PersistenceStorage } from '../../persistence/persistence.storage';
import { JSONFileStorage } from '../../storage/json-file.storage';
import { NotificationNotFound } from '../../../domain/errors/notification-not-found.error';
import { randomString } from '../../../../shared/strings';
import {
  CommentNotificationRepository,
  NewCommentNotificationsInput,
} from '../../../domain/repositories/comment-notification.repository';
import { NotificationType } from '../../../domain/models/notification';

const NOTIFICATIONS_FILENAME =
  './src/notifications/infrastructure/persistence/new-comment-notifications.json';

const NotificationsJSONFileStorage: PersistenceStorage<
  NewCommentNotificationPersistence[]
> = new JSONFileStorage(NOTIFICATIONS_FILENAME);

@Injectable({ scope: Scope.DEFAULT })
export class JSONCommentNotificationRepository
  implements CommentNotificationRepository
{
  private storage = NotificationsJSONFileStorage;

  async getNewCommentNotifications(
    userId: TaskFollowerId,
  ): Promise<NewCommentNotification[]> {
    const allNotifs = await this._getAllCommentNotifications();

    return allNotifs
      ?.filter((n) => n.followerId === userId && !n?.read)
      .map((n) => ({
        ...n,
        type: NotificationType.COMMENT,
      }));
  }

  async createNewCommentNotifications(
    newCommentNotificationInput: NewCommentNotificationsInput,
  ) {
    const { author, comment, followersIds, project, taskId } =
      newCommentNotificationInput;

    const currentNotifications = await this._getAllCommentNotifications();

    const newNotifications: NewCommentNotificationPersistence[] =
      followersIds.map((followerId) => ({
        author,
        comment,
        project,
        taskId,
        followerId,
        id: this._generateId(),
        read: false,
      }));

    const allNotifications = [...currentNotifications, ...newNotifications];

    await this._updateCommentNotifications(allNotifications);
  }

  async readNotification(notificationId: string) {
    const allNotifs = await this._getAllCommentNotifications();
    const notification = this._findNotificationById(allNotifs, notificationId);

    notification.read = true;

    await this._updateCommentNotifications(allNotifs);
  }

  private _generateId() {
    return randomString();
  }

  private async _getAllCommentNotifications() {
    return this.storage.get();
  }

  private async _updateCommentNotifications(
    notifs: NewCommentNotificationPersistence[],
  ) {
    this.storage.set(notifs);
  }

  private _findNotificationById(
    allNotifs: NewCommentNotificationPersistence[],
    notificationId: string,
  ) {
    const notification = allNotifs.find((n) => n.id === notificationId);

    if (!notification) {
      throw new NotificationNotFound(notificationId);
    }

    return notification;
  }
}
