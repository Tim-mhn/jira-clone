import { Test, TestingModule } from '@nestjs/testing';
import { NewCommentNotification } from '../../../domain';
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

  describe('getNewCommentNotifications', () => {
    it('it should return objecting matching exactly the shape of NewCommentNotification (no undesired DB fields)', async () => {
      const dbNotif: CommentNotificationPersistence = {
        author: {
          id: 'author-id',
          name: 'author-name',
          uuid: 'author-uuid',
        },
        authorUuid: 'author-uuid',
        comment: 'comment',
        createdAt: new Date(),
        followerId: 'follower-id',
        id: 'notification-id',
        project: {
          id: 'project-id',
          name: 'project-name',
          uuid: 'project-uuid',
        },
        read: false,
        taskId: 'task-id',
        taskProjectUuid: 'project-uuid',
      };
      const mockPersistenceData: CommentNotificationPersistence[] = [dbNotif];
      jest
        .spyOn(repo.prisma.commentNotification, 'findMany')
        .mockImplementationOnce((async () => mockPersistenceData) as any);

      const commentNotifications = await repo.getNewCommentNotifications(
        'user-id',
      );

      const expectedNotification: NewCommentNotification = {
        author: {
          id: dbNotif.author.id,
          name: dbNotif.author.name,
        },
        comment: dbNotif.comment,
        id: dbNotif.id,
        project: {
          id: dbNotif.project.id,
          name: dbNotif.project.name,
        },
        taskId: dbNotif.taskId,
        type: NotificationType.COMMENT,
      };

      expect(commentNotifications[0]).toEqual(expectedNotification);
    });
  });
});
