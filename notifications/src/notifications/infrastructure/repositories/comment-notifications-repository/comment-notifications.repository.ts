import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NewCommentNotification } from '../../../domain';
import { NotificationType } from '../../../domain/models/notification';
import {
  CommentNotificationsRepository,
  NewCommentNotificationsInput,
} from '../../../domain/repositories/comment-notification.repository';
import { CommentNotificationPersistence } from '../../persistence/comment-notification.persistence';

@Injectable()
export class DBCommentNotificationsRepository
  implements CommentNotificationsRepository
{
  prisma = new PrismaClient();

  async getNewCommentNotifications(
    _userId: string,
  ): Promise<NewCommentNotification[]> {
    const commentNotifications = await this.prisma.commentNotification.findMany(
      {
        where: {
          author: {
            id: _userId,
          },
        },
        include: {
          author: true,
          project: true,
        },
      },
    );

    return commentNotifications.map((n) =>
      this._mapDBToDomainCommentNotification(n),
    );
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
