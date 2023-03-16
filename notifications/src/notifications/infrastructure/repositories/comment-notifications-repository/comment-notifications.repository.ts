import { Injectable } from '@nestjs/common';
import { NewCommentNotification } from '../../../domain';
import { NotificationType } from '../../../domain/models/notification';
import {
  CommentNotificationsRepository,
  NewCommentNotificationsInput,
} from '../../../domain/repositories/comment-notification.repository';
import { prismaClient } from '../../database';
import { CommentNotificationPersistence } from '../../persistence/comment-notification.persistence';
import { SELECT_ID_NAME } from '../db-selectors';

@Injectable()
export class DBCommentNotificationsRepository
  implements CommentNotificationsRepository
{
  private prisma = prismaClient;

  async getNewCommentNotifications(
    userId: string,
  ): Promise<NewCommentNotification[]> {
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
  ): NewCommentNotification {
    const {
      id,
      data: { comment, taskId, author, project },
    } = dbNotif;

    return {
      id,
      taskId,
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

  async createNewCommentNotifications(
    newCommentNotification: NewCommentNotificationsInput,
  ): Promise<void> {
    const { author, comment, project, taskId, followersIds } =
      newCommentNotification;
    try {
      const commentNotificationsCreateData = followersIds.map((followerId) => ({
        followerId,
      }));

      await this.prisma.commentNotificationData.create({
        data: {
          comment,
          taskId,
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
    await this.prisma.commentNotification.update({
      where: {
        id: notificationId,
      },
      data: {
        read: true,
      },
    });
  }
}
