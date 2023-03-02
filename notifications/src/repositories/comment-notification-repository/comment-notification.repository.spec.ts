/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { NewCommentNotification } from '../../models';
import { NewCommentNotificationPersistence } from '../../persistence/new-comment-notification.persistence';
import { TaskFollowersRepository } from '../task-followers-repository/task-followers.repository';
import {
  CommentNotificationRepository,
  FileIO,
} from './comment-notification.repository';

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
    const mockFileIO: FileIO<NewCommentNotificationPersistence[]> = {
      readFile: async (_filename: string) => await [],
      writeFile: async (
        _filename: string,
        _data: NewCommentNotificationPersistence[],
      ) => new Promise<void>((res) => res()),
    };

    beforeEach(() => {
      repo['fileIO'] = mockFileIO;
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
        .mockImplementation(() => tasksFollowed);
    });

    it('should return the comment notification initially (no reads)', async () => {
      repo.createNewCommentNotification(DUMMY_COMMENT_NOTIF);

      const persistenceData: NewCommentNotificationPersistence[] = [
        {
          ...DUMMY_COMMENT_NOTIF,
          readBy: new Set(),
        },
      ];
      jest
        .spyOn(mockFileIO, 'readFile')
        .mockImplementation(async () => await persistenceData);
      const notifs = await repo.getNewCommentNotifications(FOLLOWER_ID);
      const notifTasksIds = notifs?.map((n) => n.taskId);

      expect(notifTasksIds).toContain(tasksFollowed[0]);
    });

    it('should not return a comment notification after it has been read', async () => {
      const readBy = new Set<string>();
      readBy.add(FOLLOWER_ID);
      const persistenceData: NewCommentNotificationPersistence[] = [
        {
          ...DUMMY_COMMENT_NOTIF,
          comment: 'other comment',
          readBy,
        },
      ];
      jest
        .spyOn(mockFileIO, 'readFile')
        .mockImplementation(async () => await persistenceData);

      const notifs = await repo.getNewCommentNotifications(FOLLOWER_ID);
      const notifTasksIds = notifs?.map((n) => n.id);

      expect(notifTasksIds).not.toContain(NOTIF_ID);
    });
  });
});
