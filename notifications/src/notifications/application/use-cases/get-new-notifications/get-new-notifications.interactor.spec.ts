import { Test, TestingModule } from '@nestjs/testing';
import { TaskAssignationNotificationData } from '../../../domain';
import { getMockCommentNotificationsRepository } from '../../../domain/mocks';
import { TaskAssignationNotificationsRepository } from '../../../domain/repositories/assignation-notification.repository';
import { TaskAssignationNotificationsRepositoryToken } from '../../../adapter/providers';
import { CommentNotificationsRepositoryToken } from '../../../adapter/providers/comment-notification-repository.provider';
import { GetNewNotificationsInteractor } from './get-new-notifications.interactor';

describe('GetNewNotificationsInteractor', () => {
  const mockAssignationNotifsRepo: TaskAssignationNotificationsRepository = {
    create: async (_data: Omit<TaskAssignationNotificationData, 'id'>) => null,
    readNotification: async (_notificationId: string) => null,
    getNewNotifications: async (_userId: string) => null,
    dismissNotificationsFromTask: jest.fn(),
  };

  const mockCommentNotifsRepo = getMockCommentNotificationsRepository();

  let service: GetNewNotificationsInteractor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetNewNotificationsInteractor,
        {
          provide: CommentNotificationsRepositoryToken,
          useValue: mockCommentNotifsRepo,
        },
        {
          provide: TaskAssignationNotificationsRepositoryToken,
          useValue: mockAssignationNotifsRepo,
        },
      ],
    }).compile();

    service = module.get<GetNewNotificationsInteractor>(
      GetNewNotificationsInteractor,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
