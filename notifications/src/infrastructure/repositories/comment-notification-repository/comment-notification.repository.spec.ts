/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationNotFound } from '../../../domain/errors/notification-not-found.error';
import { CommentAuthor, NewCommentNotification } from '../../../domain/models';
import { NewCommentNotificationPersistence } from '../../persistence/new-comment-notification.persistence';
import { PersistenceStorage } from '../../persistence/persistence.storage';
import { TaskFollowersRepository } from '../task-followers-repository/task-followers.repository';
import { CommentNotificationRepository } from './comment-notification.repository';

describe('CommentNotificationRepository', () => {
  let repo: CommentNotificationRepository;

  let followersRepo: TaskFollowersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentNotificationRepository, TaskFollowersRepository],
    }).compile();

    followersRepo = module.get<TaskFollowersRepository>(
      TaskFollowersRepository,
    );
    repo = module.get<CommentNotificationRepository>(
      CommentNotificationRepository,
    );
  });
  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  describe('getNewCommentNotifications', () => {
    const mockStorage: PersistenceStorage<NewCommentNotificationPersistence[]> =
      {
        get: async () => await [],
        set: async (_data: NewCommentNotificationPersistence[]) =>
          new Promise<void>((res) => res()),
      };

    beforeEach(() => {
      repo['storage'] = mockStorage;
    });

    const TASK_ID = 'task-id';
    const NOTIF_ID = 'notificaiton-id-xyz';
    const DUMMY_COMMENT_NOTIF: NewCommentNotification = {
      author: null,
      comment: 'comment',
      project: null,
      taskId: TASK_ID,
      id: NOTIF_ID,
    };

    const FOLLOWER_ID = 'follower-id';

    const tasksFollowed = [TASK_ID];

    beforeEach(() => {
      jest
        .spyOn(followersRepo, 'getTasksFollowedByUser')
        .mockImplementation(async () => tasksFollowed);
    });

    it('should return the comment notification initially (no reads)', async () => {
      repo.createNewCommentNotification(DUMMY_COMMENT_NOTIF);

      const persistenceData: NewCommentNotificationPersistence[] = [
        {
          ...DUMMY_COMMENT_NOTIF,
          readBy: [],
        },
      ];
      jest
        .spyOn(mockStorage, 'get')
        .mockImplementation(async () => await persistenceData);
      const notifs = await repo.getNewCommentNotifications(FOLLOWER_ID);
      const notifTasksIds = notifs?.map((n) => n.taskId);

      expect(notifTasksIds).toContain(tasksFollowed[0]);
    });

    it('should not return a comment notification after it has been read', async () => {
      const readBy = [FOLLOWER_ID];
      const persistenceData: NewCommentNotificationPersistence[] = [
        {
          ...DUMMY_COMMENT_NOTIF,
          comment: 'other comment',
          readBy,
        },
      ];
      jest
        .spyOn(mockStorage, 'get')
        .mockImplementation(async () => await persistenceData);

      const notifs = await repo.getNewCommentNotifications(FOLLOWER_ID);
      const notifTasksIds = notifs?.map((n) => n.id);

      expect(notifTasksIds).not.toContain(NOTIF_ID);
    });
  });

  describe('markNotificationAsReadByUser', () => {
    let allNotifications: NewCommentNotificationPersistence[] = [];

    const mockStorage: PersistenceStorage<NewCommentNotificationPersistence[]> =
      {
        get: async () => await allNotifications,
        set: async (data: NewCommentNotificationPersistence[]) =>
          new Promise<void>((res) => {
            allNotifications = data;
            res();
          }),
      };

    const notifId = 'ceac848c4e84a9c';
    const author: CommentAuthor = {
      id: 'author-id',
      name: 'author-name',
    };

    const taskId = 'task-id-xyz';

    const notif: NewCommentNotificationPersistence = {
      id: notifId,
      author,
      comment: 'comment',
      project: null,
      taskId,
      readBy: [],
    };

    const followerId = 'follower-id';

    beforeEach(() => {
      allNotifications = [];
      allNotifications.push(notif);
      repo['storage'] = mockStorage;

      const tasksFollowed = [taskId];

      jest
        .spyOn(followersRepo, 'getTasksFollowedByUser')
        .mockImplementation(async () => tasksFollowed);
    });

    it('should not return a notification after it has been read', async () => {
      const newNotificationsBeforeRead = await repo.getNewCommentNotifications(
        followerId,
      );

      await repo.markNotificationAsReadByUser({
        followerId,
        notificationId: notifId,
      });

      const newNotifications = await repo.getNewCommentNotifications(
        followerId,
      );

      expect(newNotificationsBeforeRead).toContain(notif);
      expect(newNotifications).not.toContain(notif);
    });

    it('should throw a NotificationNotFound error if the notification does not exist', async () => {
      const inexistentNotifId = 'not-existent';

      const readFn = () =>
        repo.markNotificationAsReadByUser({
          followerId,
          notificationId: inexistentNotifId,
        });

      await expect(readFn).rejects.toThrowError(NotificationNotFound);
    });
  });
});
