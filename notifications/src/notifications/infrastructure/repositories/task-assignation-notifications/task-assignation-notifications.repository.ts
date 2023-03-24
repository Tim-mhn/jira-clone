import { Injectable } from '@nestjs/common';
import {
  TaskAssignationNotificationData,
  TaskAssignationNotification,
} from '../../../domain';
import { NotificationType } from '../../../domain/models/notification';
import { TaskAssignationNotificationsRepository } from '../../../domain/repositories/assignation-notification.repository';
import { prismaClient } from '../../database';
import { SELECT_PROJECT_ID_NAME } from '../db-selectors';

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
    const {
      assigneeId,
      project,
      task: { id: taskId, title: taskTitle },
    } = createTaskAssignationNotification;
    await this.prisma.taskAssignationNotification.create({
      data: {
        taskId,
        taskTitle,
        assigneeId,
        project: {
          create: project,
        },
      },
    });
  }

  async readNotification(notificationId: string): Promise<void> {
    await this.prisma.taskAssignationNotification.update({
      where: {
        id: notificationId,
      },
      data: {
        read: true,
      },
    });
  }

  async getNewNotifications(
    userId: string,
  ): Promise<TaskAssignationNotification[]> {
    const dbNotifs = await this.prisma.taskAssignationNotification.findMany({
      where: {
        AND: {
          read: false,
          dismissed: false,
          assigneeId: userId,
        },
      },
      select: {
        id: true,
        taskId: true,
        taskTitle: true,
        project: SELECT_PROJECT_ID_NAME,
        assigneeId: true,
      },
    });

    return dbNotifs.map((dbNotif) => {
      const { taskId, taskTitle, assigneeId, id, project } = dbNotif;
      return {
        assigneeId,
        id,
        project,
        task: {
          id: taskId,
          title: taskTitle,
        },
        type: NotificationType.ASSIGNATION,
      };
    });
  }

  async dismissNotificationsFromTask(taskId: string): Promise<void> {
    await this.prisma.taskAssignationNotification.updateMany({
      where: {
        taskId: taskId,
      },
      data: {
        dismissed: true,
      },
    });
  }
}
