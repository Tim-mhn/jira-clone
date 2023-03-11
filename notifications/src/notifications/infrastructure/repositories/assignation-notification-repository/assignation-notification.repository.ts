import { Injectable, Scope } from '@nestjs/common';
import { randomString } from '../../../../shared/strings';
import { NotificationType } from '../../../domain/models/notification';
import {
  TaskAssignationNotification,
  TaskAssignationNotificationData,
} from '../../../domain/models/task-assignation-notification';
import { TaskAssignationNotificationRepository } from '../../../domain/repositories/assignation-notification.repository';
import { PersistenceStorage } from '../../persistence/persistence.storage';
import { TaskAssignationNotificationPersistence } from '../../persistence/task-assignation-notification.persistence';
import { JSONFileStorage } from '../../storage/json-file.storage';

const NOTIFICATIONS_FILENAME =
  './src/notifications/infrastructure/persistence/task-assignation-notifications.json';

const NotificationsJSONFileStorage: PersistenceStorage<
  TaskAssignationNotificationPersistence[]
> = new JSONFileStorage(NOTIFICATIONS_FILENAME);

@Injectable({ scope: Scope.DEFAULT })
export class JSONTaskAssignationNotificationRepository
  implements TaskAssignationNotificationRepository
{
  async getNewNotifications(
    userId: string,
  ): Promise<TaskAssignationNotification[]> {
    const allNotifs = await this.storage.get();
    return allNotifs
      ?.filter((n) => n.assigneeId === userId && !n.read)
      .map((n) => ({ ...n, type: NotificationType.ASSIGNATION }));
  }
  private storage = NotificationsJSONFileStorage;

  async create(data: Omit<TaskAssignationNotificationData, 'id'>) {
    const allNotifs = await this.storage.get();
    const id = randomString();
    const notif: TaskAssignationNotificationPersistence = {
      ...data,
      id,
      read: false,
    };
    const allNotifsWithNew = [...allNotifs, notif];
    this.storage.set(allNotifsWithNew);
  }

  async markNotificationAsRead(notificationId: string) {
    const allNotifs = await this.storage.get();
    const notif = allNotifs?.find((n) => n.id === notificationId);
    if (notif) notif.read = true;
    this.storage.set(allNotifs);
  }
}
