/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationNotFound } from '../../../domain/errors/notification-not-found.error';
import { CommentAuthor, NewCommentNotification } from '../../../domain/models';
import { NotificationType } from '../../../domain/models/notification';
import { NewCommentNotificationsInput } from '../../../domain/repositories/comment-notification.repository';
import { CommentNotificationPersistence } from '../../persistence/new-comment-notification.persistence';
import { PersistenceStorage } from '../../persistence/persistence.storage';
import { TaskFollowersRepository } from '../task-followers-repository/task-followers.repository';
import { JSONCommentNotificationRepository } from './comment-notification.repository';

describe('CommentNotificationRepository', () => {
  let repo: JSONCommentNotificationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JSONCommentNotificationRepository, TaskFollowersRepository],
    }).compile();

    repo = module.get<JSONCommentNotificationRepository>(
      JSONCommentNotificationRepository,
    );
  });
  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  describe('getNewCommentNotifications', () => {
    const mockStorage: PersistenceStorage<CommentNotificationPersistence[]> = {
      get: async () => await [],
      set: async (_data: CommentNotificationPersistence[]) =>
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
      type: NotificationType.COMMENT,
    };

    const FOLLOWER_ID = 'follower-id';

    const tasksFollowed = [TASK_ID];

    it('should return the comment notification initially (not read)', async () => {
      const input: NewCommentNotificationsInput = {
        ...DUMMY_COMMENT_NOTIF,
        followersIds: [FOLLOWER_ID],
      };

      repo.createNewCommentNotifications(input);

      const persistenceData: CommentNotificationPersistence[] = [
        {
          ...DUMMY_COMMENT_NOTIF,
          read: false,
          followerId: FOLLOWER_ID,
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
      const persistenceData: CommentNotificationPersistence[] = [
        {
          ...DUMMY_COMMENT_NOTIF,
          comment: 'other comment',
          read: true,
          followerId: FOLLOWER_ID,
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

  describe('readNotification', () => {
    let allNotifications: CommentNotificationPersistence[] = [];

    const mockStorage: PersistenceStorage<CommentNotificationPersistence[]> = {
      get: async () => await allNotifications,
      set: async (data: CommentNotificationPersistence[]) =>
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

    const followerId = 'follower-id';

    const notif: CommentNotificationPersistence = {
      id: notifId,
      author,
      comment: 'comment',
      project: null,
      taskId,
      read: false,
      followerId: followerId,
    };

    beforeEach(() => {
      allNotifications = [];
      allNotifications.push(notif);
      repo['storage'] = mockStorage;
    });

    it('should not return a notification after it has been read', async () => {
      const newNotificationsBeforeRead = await repo.getNewCommentNotifications(
        followerId,
      );

      const idsOfNotifsBeforeRead = newNotificationsBeforeRead.map((n) => n.id);

      await repo.readNotification(notifId);

      const newNotifications = await repo.getNewCommentNotifications(
        followerId,
      );

      expect(idsOfNotifsBeforeRead).toContain(notif.id);
      expect(newNotifications).not.toContain(notif);
    });

    it('should throw a NotificationNotFound error if the notification does not exist', async () => {
      const inexistentNotifId = 'not-existent';

      const readFn = () => repo.readNotification(inexistentNotifId);

      await expect(readFn).rejects.toThrowError(NotificationNotFound);
    });
  });

  describe('createNewCommentNotifications', () => {
    beforeEach(() => {
      let allNotifications: CommentNotificationPersistence[] = [];

      const mockStorage: PersistenceStorage<CommentNotificationPersistence[]> =
        {
          get: async () => await allNotifications,
          set: async (data: CommentNotificationPersistence[]) =>
            new Promise<void>((res) => {
              allNotifications = data;
              res();
            }),
        };

      repo['storage'] = mockStorage;
    });
    it('should create as many new notifications as there are task followers', async () => {
      const followersIds = ['user-a', 'user-b', 'user-c'];

      const input: NewCommentNotificationsInput = {
        author: {
          id: 'author-id',
          name: 'author-name',
        },
        comment: 'a special comment from this author ',
        followersIds,
        project: null,
        taskId: 'task-id-12345',
      };

      const allPreviousNotifs = await repo['storage'].get();
      await repo.createNewCommentNotifications(input);

      const allNotifications = await repo['storage'].get();

      const newNotificationsFollowersIds = (await repo['storage'].get())
        .filter((n) => n.comment === input.comment)
        .map((n) => n.followerId);

      expect(allNotifications.length - allPreviousNotifs.length).toEqual(
        followersIds.length,
      );

      expect(newNotificationsFollowersIds).toEqual(followersIds);
    });
  });
});
