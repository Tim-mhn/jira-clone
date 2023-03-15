import { Test, TestingModule } from '@nestjs/testing';
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
    it('it should return return the COMMENT type', async () => {
      const dbNotif: CommentNotificationPersistence = {
        author: {
          id: 'author-id',
          name: 'author-name',
        },
        comment: 'comment',
        id: 'notification-id',
        project: {
          id: 'project-id',
          name: 'project-name',
        },
        taskId: 'task-id',
      };
      const mockPersistenceData: CommentNotificationPersistence[] = [dbNotif];
      jest
        .spyOn(repo as any, '_getDBComments')
        .mockImplementationOnce((async () => mockPersistenceData) as any);

      const commentNotifications = await repo.getNewCommentNotifications(
        'user-id',
      );

      expect(commentNotifications[0].type).toEqual(NotificationType.COMMENT);
    });
  });
});
