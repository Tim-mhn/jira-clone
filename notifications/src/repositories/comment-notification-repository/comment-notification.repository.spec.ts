import { Test, TestingModule } from '@nestjs/testing';
import { NewCommentNotification } from '../../models';
import { TaskFollowersRepository } from '../task-followers-repository/task-followers.repository';
import { CommentNotificationRepository } from './comment-notification.repository';

describe('CommentNotificationRepository', () => {
  let repo: CommentNotificationRepository;

  let followersRepo: TaskFollowersRepository;
  // TaskFollowersRepository.cle
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

    it('should return the comment notification initially (no reads)', () => {
      repo.createNewCommentNotification(DUMMY_COMMENT_NOTIF);

      const notifs = repo.getNewCommentNotifications(FOLLOWER_ID);
      const notifTasksIds = notifs?.map((n) => n.taskId);

      expect(notifTasksIds).toContain(tasksFollowed[0]);
    });

    it('should not return a comment notification after it has been read', () => {
      repo.createNewCommentNotification(DUMMY_COMMENT_NOTIF);

      repo.markNotificationAsReadByUser({
        followerId: FOLLOWER_ID,
        notificationId: NOTIF_ID,
      });

      const notifs = repo.getNewCommentNotifications(FOLLOWER_ID);
      const notifTasksIds = notifs?.map((n) => n.id);

      expect(notifTasksIds).not.toContain(NOTIF_ID);
    });
  });
});
