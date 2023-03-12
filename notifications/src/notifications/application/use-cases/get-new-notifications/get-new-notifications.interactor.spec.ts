import { Test, TestingModule } from '@nestjs/testing';
import { TaskAssignationNotificationData } from '../../../domain';
import { getMockCommentNotificationsRepository } from '../../../domain/mocks';
import { TaskAssignationNotificationRepository } from '../../../domain/repositories/assignation-notification.repository';
import { TaskAssignationNotificationRepositoryToken } from '../../../infrastructure/providers';
import { CommentNotificationRepositoryToken } from '../../../infrastructure/providers/comment-notification-repository.provider';
import { GetNewNotificationsInteractor } from './get-new-notifications.interactor';

describe('GetNewNotificationsInteractor', () => {
  const mockAssignationNotifsRepo: TaskAssignationNotificationRepository = {
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
          provide: CommentNotificationRepositoryToken,
          useValue: mockCommentNotifsRepo,
        },
        {
          provide: TaskAssignationNotificationRepositoryToken,
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
