import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CommentNotification, NotificationNotFound } from '../../../domain';
import { NotificationType } from '../../../domain/models/notification';
import {
  CommentNotificationsRepository,
  CommentNotificationsInput,
} from '../../../domain/repositories/comment-notification.repository';
import { prismaClient } from '../../database';
import { CommentNotificationPersistence } from '../../persistence/comment-notification.persistence';
import { SELECT_ID_NAME } from '../db-selectors';

@Injectable()
export class DBCommentNotificationsRepository
  implements CommentNotificationsRepository
{
  private prisma = prismaClient;

  async getCommentNotifications(
    userId: string,
  ): Promise<CommentNotification[]> {
    const commentNotifications = await this._getDBComments(userId);

    return commentNotifications.map((n) =>
      this._mapDBToDomainCommentNotification(n),
    );
  }

  private async _getDBComments(
    userId: string,
  ): Promise<CommentNotificationPersistence[]> {
    return await this.prisma.commentNotification.findMany({
      select: {
        data: {
          select: {
            author: SELECT_ID_NAME,
            project: SELECT_ID_NAME,
            comment: true,
            taskId: true,
            taskTitle: true,
          },
        },
        id: true,
      },

      where: {
        followerId: userId,
        read: false,
      },
    });
  }

  private _mapDBToDomainCommentNotification(
    dbNotif: CommentNotificationPersistence,
  ): CommentNotification {
    const {
      id,
      data: { comment, author, project, taskId, taskTitle },
    } = dbNotif;

    return {
      id,
      task: {
        id: taskId,
        title: taskTitle,
      },
      comment,
      author: {
        id: author.id,
        name: author.name,
      },
      project: {
        id: project.id,
        name: project.name,
      },
      type: NotificationType.COMMENT,
    };
  }

  async createCommentNotifications(
    newCommentNotification: CommentNotificationsInput,
  ): Promise<void> {
    const {
      author,
      comment,
      project,
      task: { id: taskId, title: taskTitle },
      followersIds,
    } = newCommentNotification;
    try {
      const commentNotificationsCreateData = followersIds.map((followerId) => ({
        followerId,
      }));

      await this.prisma.commentNotificationData.create({
        data: {
          comment,
          taskId,
          taskTitle,
          author: {
            create: author,
          },
          project: {
            create: project,
          },
          commentNotifications: {
            createMany: {
              data: commentNotificationsCreateData,
            },
          },
        },
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async readNotification(notificationId: string): Promise<void> {
    try {
      await this.prisma.commentNotification.update({
        where: {
          id: notificationId,
        },
        data: {
          read: true,
        },
      });
    } catch (err) {
      this._throwNotificationNotFoundOrOtherError(err, notificationId);
    }
  }

  private _throwNotificationNotFoundOrOtherError(
    err: Error,
    notificationId: string,
  ) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        throw new NotificationNotFound(notificationId);
      }
    }

    throw err;
  }
}
