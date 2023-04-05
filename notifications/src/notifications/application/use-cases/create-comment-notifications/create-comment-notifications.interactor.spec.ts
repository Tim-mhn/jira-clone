import { Test, TestingModule } from '@nestjs/testing';
import { NewCommentEvent } from '../../../domain/events/new-comment.event';
import {
  getMockCommentNotificationsRepository,
  getMockTaskFollowersRepository,
} from '../../../domain/mocks';
import {
  CommentNotificationsInput,
  CreateCommentNotificationsOutput,
} from '../../../domain/repositories/comment-notification.repository';
import { CommentNotificationsRepositoryToken } from '../../../adapter/providers/comment-notification-repository.provider';
import { TaskFollowersRepositoryToken } from '../../../adapter/providers/task-followers-repository.provider';
import { CreateCommentNotificationsInteractor } from './create-comment-notifications.interactor';
import { NewNotificationEmitter } from '../../emitters/new-notification.emitter';

describe('CreateCommentNotificationsInteractor', () => {
  let service: CreateCommentNotificationsInteractor;

  const mockCommentsNotifsRepo = getMockCommentNotificationsRepository();
  const mockTaskFollowersRepo = getMockTaskFollowersRepository();

  let notificationEmitter: NewNotificationEmitter;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCommentNotificationsInteractor,
        {
          provide: CommentNotificationsRepositoryToken,
          useValue: mockCommentsNotifsRepo,
        },
        {
          provide: TaskFollowersRepositoryToken,
          useValue: mockTaskFollowersRepo,
        },
        NewNotificationEmitter,
      ],
    }).compile();

    notificationEmitter = module.get<NewNotificationEmitter>(
      NewNotificationEmitter,
    );
    service = module.get<CreateCommentNotificationsInteractor>(
      CreateCommentNotificationsInteractor,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNotificationsForTaskFollowersExceptCommentAuthor', () => {
    const taskId = 'task-id-xyz';
    const commentAuthorId = 'comment-author-id';

    const newCommentEvent: NewCommentEvent = {
      author: {
        id: commentAuthorId,
        name: 'author name',
      },
      comment: 'comment',
      project: null,
      task: {
        id: taskId,
        title: 'Task Title',
      },
    };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should create a notification for all followers except for the comment author', async () => {
      const followerIds = [commentAuthorId, 'follower-a', 'follower-b'];

      jest
        .spyOn(mockTaskFollowersRepo, 'getTaskFollowersIds')
        .mockImplementation(async () => followerIds);

      await service.createNotificationsForTaskFollowersExceptCommentAuthor(
        newCommentEvent,
      );

      const allFollowersIdsExceptAuthor = ['follower-a', 'follower-b'];

      const expectedInput: CommentNotificationsInput = {
        ...newCommentEvent,
        followersIds: allFollowersIdsExceptAuthor,
      };

      expect(
        mockCommentsNotifsRepo.createCommentNotifications,
      ).toHaveBeenCalledWith(expectedInput);
    });

    it('should not call repo.createCommentNotifications if there are no followers for this task', async () => {
      jest
        .spyOn(mockTaskFollowersRepo, 'getTaskFollowersIds')
        .mockImplementation(async () => []);

      await service.createNotificationsForTaskFollowersExceptCommentAuthor(
        newCommentEvent,
      );

      expect(
        mockCommentsNotifsRepo.createCommentNotifications,
      ).not.toBeCalled();
    });

    it('should call getTaskFollowersIds with the correct task id', async () => {
      await service.createNotificationsForTaskFollowersExceptCommentAuthor(
        newCommentEvent,
      );

      expect(mockTaskFollowersRepo.getTaskFollowersIds).toHaveBeenCalledWith(
        taskId,
      );
    });

    it('should call the NotificationsEmitter with the list of correctly built CommentNotifications', async () => {
      const followerIds = ['follower-1', 'follower-2', 'follower-3'];

      const createCommentNotificationsOutput: CreateCommentNotificationsOutput =
        [
          {
            followerId: 'follower-1',
            notificationId: 'notif-1',
          },
          {
            followerId: 'follower-2',
            notificationId: 'notif-2',
          },
          {
            followerId: 'follower-3',
            notificationId: 'notif-3',
          },
        ];

      jest
        .spyOn(mockTaskFollowersRepo, 'getTaskFollowersIds')
        .mockImplementation(async () => followerIds);
      jest.spyOn(notificationEmitter, 'fireNewNotificationEvent');
      jest
        .spyOn(mockCommentsNotifsRepo, 'createCommentNotifications')
        .mockImplementation(async () => createCommentNotificationsOutput);
      await service.createNotificationsForTaskFollowersExceptCommentAuthor(
        newCommentEvent,
      );

      expect(
        notificationEmitter.fireNewNotificationEvent,
      ).toHaveBeenCalledTimes(3);
    });
  });
});
