import { Injectable } from '@nestjs/common';
import {
  TaskAssignationNotificationData,
  TaskAssignationNotification,
} from '../../../domain';
import { TaskAssignationNotificationsRepository } from '../../../domain/repositories/assignation-notification.repository';
import { prismaClient } from '../../database';

@Injectable()
export class DBTaskAssignationNotificationsRepository
  implements TaskAssignationNotificationsRepository
{
  prisma = prismaClient;
  async create(
    createTaskAssignationNotification: Omit<
      TaskAssignationNotificationData,
      'id'
    >,
  ): Promise<void> {
    const { assigneeId, project, taskId } = createTaskAssignationNotification;
    await this.prisma.taskAssignationNotification.create({
      data: {
        taskId,
        assigneeId,
        project: {
          create: project,
        },
      },
    });
  }
  readNotification(_notificationId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getNewNotifications(_userId: string): Promise<TaskAssignationNotification[]> {
    throw new Error('Method not implemented.');
  }
  dismissNotificationsFromTask(_taskId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
