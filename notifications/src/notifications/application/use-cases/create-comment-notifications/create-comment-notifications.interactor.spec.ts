import { Test, TestingModule } from '@nestjs/testing';
import { NewCommentEvent } from '../../../domain/events/new-comment.event';
import {
  getMockCommentNotificationsRepository,
  getMockTaskFollowersRepository,
} from '../../../domain/mocks';
import { NewCommentNotificationsInput } from '../../../domain/repositories/comment-notification.repository';
import { CommentNotificationsRepositoryToken } from '../../../infrastructure/providers/comment-notification-repository.provider';
import { TaskFollowersRepositoryToken } from '../../../infrastructure/providers/task-followers-repository.provider';
import { CreateCommentNotificationsInteractor } from './create-comment-notifications.interactor';

describe('CreateCommentNotificationsInteractor', () => {
  let service: CreateCommentNotificationsInteractor;

  const mockCommentsNotifsRepo = getMockCommentNotificationsRepository();
  const mockTaskFollowersRepo = getMockTaskFollowersRepository();
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
      ],
    }).compile();

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
      taskId,
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
      const expectedInput: NewCommentNotificationsInput = {
        ...newCommentEvent,
        followersIds: allFollowersIdsExceptAuthor,
      };

      expect(
        mockCommentsNotifsRepo.createNewCommentNotifications,
      ).toHaveBeenCalledWith(expectedInput);
    });

    it('should not call repo.createNewCommentNotifications if there are no followers for this task', async () => {
      jest
        .spyOn(mockTaskFollowersRepo, 'getTaskFollowersIds')
        .mockImplementation(async () => []);

      await service.createNotificationsForTaskFollowersExceptCommentAuthor(
        newCommentEvent,
      );

      expect(
        mockCommentsNotifsRepo.createNewCommentNotifications,
      ).not.toBeCalled();
    });
  });
});
