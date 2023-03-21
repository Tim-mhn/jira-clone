import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { NotificationNotFound } from '../../../domain';
import { Task } from '../../../domain/models';
import { NotificationType } from '../../../domain/models/notification';
import { CommentNotificationPersistence } from '../../persistence/comment-notification.persistence';
import { DBCommentNotificationsRepository } from './comment-notifications.repository';

describe('CommentNotificationsRepositoryService', () => {
  let repo: DBCommentNotificationsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DBCommentNotificationsRepository],
    }).compile();

    repo = module.get<DBCommentNotificationsRepository>(
      DBCommentNotificationsRepository,
    );
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  describe('getCommentNotifications', () => {
    const dbNotif: CommentNotificationPersistence = {
      data: {
        id: 'comment-notification-data-id',
        author: {
          id: 'author-id',
          name: 'author-name',
        },
        comment: 'comment',
        project: {
          id: 'project-id',
          name: 'project-name',
        },
        taskName: 'task-name',
        taskId: 'task-id',
      },

      id: 'notification-id',
    };

    const mockPersistenceData: CommentNotificationPersistence[] = [dbNotif];

    beforeEach(() => {
      jest
        .spyOn(repo as any, '_getDBComments')
        .mockImplementationOnce((async () => mockPersistenceData) as any);
    });

    it('it should return return the COMMENT type', async () => {
      const commentNotifications = await repo.getCommentNotifications(
        'user-id',
      );

      expect(commentNotifications[0].type).toEqual(NotificationType.COMMENT);
    });

    it('should return the notification id and not the notification-data id ', async () => {
      const commentNotifications = await repo.getCommentNotifications(
        'user-id',
      );

      expect(commentNotifications[0].id).toEqual('notification-id');
    });

    it('should correctly map the task id and and name', async () => {
      const commentNotifications = await repo.getCommentNotifications(
        'user-id',
      );

      const expectedTask: Task = {
        id: dbNotif.data.taskId,
        name: dbNotif.data.taskName,
      };
      expect(commentNotifications[0].task).toEqual(expectedTask);
    });
  });

  describe('readNotification', () => {
    it('should throw a  NotificationNotFound error if prisma code is P2025', async () => {
      jest
        .spyOn((repo as any).prisma.commentNotification, 'update')
        .mockImplementation(async () => {
          throw new Prisma.PrismaClientKnownRequestError(
            'An operation failed because it depends on one or more records that were required but not found.',
            {
              code: 'P2025',
              clientVersion: '',
            },
          );
        });

      const readFn = () =>
        repo.readNotification('if-of-notification-does-not-exist');

      await expect(readFn()).rejects.toThrow(NotificationNotFound);
    });
  });
});
