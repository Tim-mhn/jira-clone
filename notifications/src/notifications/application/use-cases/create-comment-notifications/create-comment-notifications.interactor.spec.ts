import { Test, TestingModule } from '@nestjs/testing';
import { NewCommentEvent } from '../../../domain/events/new-comment.event';
import {
  getMockCommentNotificationsRepository,
  getMockTaskFollowersRepository,
} from '../../../domain/mocks';
import { NewCommentNotificationsInput } from '../../../domain/repositories/comment-notification.repository';
import { CommentNotificationsRepositoryToken } from '../../../infrastructure/providers/comment-notification-repository.provider';
import { TaskFollowersRepository } from '../../../infrastructure/repositories/task-followers-repository/task-followers.repository';
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
          provide: TaskFollowersRepository,
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

  it('should create a notification for all followers except for the comment author', async () => {
    const commentAuthorId = 'comment-author-id';
    const followerIds = [commentAuthorId, 'follower-a', 'follower-b'];

    const taskId = 'task-id-xyz';
    const newCommentEvent: NewCommentEvent = {
      author: {
        id: commentAuthorId,
        name: 'author name',
      },
      comment: 'comment',
      project: null,
      taskId,
    };

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
});
