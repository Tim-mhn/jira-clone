import { Injectable } from '@nestjs/common';
import { NewCommentNotification } from '../../../domain';
import { NotificationType } from '../../../domain/models/notification';
import {
  CommentNotificationsRepository,
  NewCommentNotificationsInput,
} from '../../../domain/repositories/comment-notification.repository';
import { prismaClient } from '../../database';
import { CommentNotificationPersistence } from '../../persistence/comment-notification.persistence';
import { SELECT_PROJECT_ID_NAME } from '../db-selectors';

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
      where: {
        author: {
          id: userId,
        },
      },

      select: {
        id: true,
        comment: true,
        taskId: true,
        read: false,

        project: SELECT_PROJECT_ID_NAME,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  private _mapDBToDomainCommentNotification(
    persistenceObject: CommentNotificationPersistence,
  ): NewCommentNotification {
    const {
      author: { id: authorId, name: authorName },
      comment,
      project: { id: projectId, name: projectName },
      id,
      taskId,
    } = persistenceObject;
    const commentNotif: NewCommentNotification = {
      author: {
        id: authorId,
        name: authorName,
      },
      comment,
      project: {
        id: projectId,
        name: projectName,
      },
      id,
      taskId,
      type: NotificationType.COMMENT,
    };

    return commentNotif;
  }

  async createNewCommentNotifications(
    newCommentNotification: NewCommentNotificationsInput,
  ): Promise<void> {
    const { author, comment, project, taskId, followersIds } =
      newCommentNotification;
    try {
      await this.prisma.commentNotification.create({
        data: {
          comment,
          taskId,
          followerId: followersIds[0],
          author: {
            create: author,
          },
          project: {
            create: project,
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
