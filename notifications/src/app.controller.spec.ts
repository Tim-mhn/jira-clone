/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { CommentNotificationRepository } from './notifications/infrastructure/repositories/comment-notification-repository/comment-notification.repository';
import { TaskFollowersRepository } from './notifications/infrastructure/repositories/task-followers-repository/task-followers.repository';
import { createMocks } from 'node-mocks-http';
import { HttpStatus } from '@nestjs/common';
import { ReadNotificationDTO } from './notifications/infrastructure/dtos';
import { AuthenticatedRequest } from './auth';
import { NotificationNotFound } from './notifications/domain';
import { TaskAssignationNotificationRepositoryProvider } from './notifications/infrastructure/providers';

describe('AppController', () => {
  let controller: AppController;

  const mockRepo = {} as CommentNotificationRepository;
  mockRepo.markNotificationAsReadByUser = () => new Promise((res) => res(null));

  const mockFollowersRepo = {} as TaskFollowersRepository;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: CommentNotificationRepository,
          useValue: mockRepo,
        },
        {
          provide: TaskFollowersRepository,
          useValue: mockFollowersRepo,
        },
        TaskAssignationNotificationRepositoryProvider,
      ],
    }).compile();
    controller = app.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST read', () => {
    it('should return a NotFound error if the repo returns a NotificationNotFound error', async () => {
      const notifId = 'notif-id';

      const { req, res } = createMocks();

      jest
        .spyOn(mockRepo, 'markNotificationAsReadByUser')
        .mockImplementationOnce(async () => {
          throw new NotificationNotFound(notifId);
        });

      const dto = new ReadNotificationDTO();
      dto.notificationId = notifId;

      req.user = { id: 'user-id', name: 'user-name' };
      await controller.userReadNotification(
        req as any as AuthenticatedRequest,
        dto,
        res,
      );

      expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
    });
  });
});
