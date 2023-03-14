import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NewCommentNotification } from '../../../domain';
import {
  CommentNotificationsRepository,
  NewCommentNotificationsInput,
} from '../../../domain/repositories/comment-notification.repository';

@Injectable()
export class DBCommentNotificationsRepositoryService
  implements CommentNotificationsRepository
{
  prisma = new PrismaClient();

  getNewCommentNotifications(
    _userId: string,
  ): Promise<NewCommentNotification[]> {
    throw new Error('');
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
  readNotification(_notificationId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
