import { Test, TestingModule } from '@nestjs/testing';
import { TaskAssignationNotificationData } from '../../../domain';
import { TaskAssignationNotificationRepository } from '../../../domain/repositories/assignation-notification.repository';
import { TaskAssignationNotificationRepositoryToken } from '../../../infrastructure/providers';
import { CommentNotificationRepository } from '../../../infrastructure/repositories/comment-notification-repository/comment-notification.repository';
import { GetNewNotificationsInteractor } from './get-new-notifications.interactor';

describe('GetNewNotificationsInteractor', () => {
  const mockAssignationNotifsRepo: TaskAssignationNotificationRepository = {
    create: async (_data: Omit<TaskAssignationNotificationData, 'id'>) => null,
    markNotificationAsRead: async (_notificationId: string) => null,
    getNewNotifications: async (_userId: string) => null,
  };

  const mockCommentNotifsRepo: CommentNotificationRepository = {
    getNewCommentNotifications: async (_userId: string) => null,
  } as any as CommentNotificationRepository;

  let service: GetNewNotificationsInteractor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetNewNotificationsInteractor,
        {
          provide: CommentNotificationRepository,
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
