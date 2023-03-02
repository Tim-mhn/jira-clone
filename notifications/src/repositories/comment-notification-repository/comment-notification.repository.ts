import { Injectable, Scope } from '@nestjs/common';
import { TaskFollowerId } from '../../models';
import {
  CommentNotificationId,
  NewCommentNotification,
} from '../../models/new-comment-notification';
import { readJSONFile, writeJSONFile } from '../../persistence/file-helpers';
import { NewCommentNotificationPersistence } from '../../persistence/new-comment-notification.persistence';
import { TaskFollowersRepository } from '../task-followers-repository/task-followers.repository';

export interface FileIO<T> {
  readFile(fileName: string): Promise<T>;
  writeFile(fileName: string, data: T): Promise<void>;
}
@Injectable({ scope: Scope.DEFAULT })
export class CommentNotificationRepository {
  private readonly NOTIFICATIONS_FILENAME =
    './src/persistence/new-comment-notifications.json';

  constructor(private followersRepo: TaskFollowersRepository) {}

  private fileIO: FileIO<NewCommentNotificationPersistence[]> = {
    readFile: readJSONFile,
    writeFile: writeJSONFile,
  };

  private async _getAllCommentNotifications() {
    return this.fileIO.readFile(this.NOTIFICATIONS_FILENAME);
  }

  private async _updateCommentNotifications(
    notifs: NewCommentNotificationPersistence[],
  ) {
    this.fileIO.writeFile(this.NOTIFICATIONS_FILENAME, notifs);
  }

  async getNewCommentNotifications(
    userId: TaskFollowerId,
  ): Promise<NewCommentNotification[]> {
    const tasksFollowedByUser =
      this.followersRepo.getTasksFollowedByUser(userId);

    const allNotifs = await this._getAllCommentNotifications();
    return allNotifs.filter((notif) => {
      const userFollowsTask = tasksFollowedByUser.includes(notif.taskId);
      if (!userFollowsTask) return false;

      const userHasNotReadNotif = !notif.readBy.has(userId);
      return userHasNotReadNotif;
    });
  }

  async createNewCommentNotification(
    newCommentNotification: Omit<NewCommentNotification, 'id'>,
  ) {
    const noReads = new Set<TaskFollowerId>();

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
    notification.readBy.add(followerId);

    await this._updateCommentNotifications(allNotifs);
  }

  private _generateId() {
    return (Math.random() + 1).toString(36).substring(15);
  }
}
