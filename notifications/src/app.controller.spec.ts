/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { CommentNotificationRepository } from './notifications/infrastructure/repositories/comment-notification-repository/comment-notification.repository';
import { TaskFollowersRepository } from './notifications/infrastructure/repositories/task-followers-repository/task-followers.repository';
import { CreateNewAssignationNotificationInteractor } from './notifications/application/use-cases/create-new-assignation-notification/create-new-assignation-notification.interactor';
import { ReadNotificationInteractor } from './notifications/application/use-cases/read-notification/read-notification.interactor';
import { NotificationNotFound } from './notifications/domain';
import { createMocks } from 'node-mocks-http';
import { ReadNotificationDTO } from './notifications/infrastructure/dtos';
import { AuthenticatedRequest } from './auth';
import { HttpStatus } from '@nestjs/common';
import { GetNewNotificationsInteractor } from './notifications/application/use-cases/get-new-notifications/get-new-notifications.interactor';

describe('AppController', () => {
  let controller: AppController;
  const mockRepo = {} as CommentNotificationRepository;
  mockRepo.markNotificationAsReadByUser = jest.fn();

  const mockReadNotifUsecase: ReadNotificationInteractor = {
    readNotification: jest.fn(),
  } as any as ReadNotificationInteractor;

  const mockFollowersRepo = {} as TaskFollowersRepository;

  const mockCreateAssignationNotif =
    {} as CreateNewAssignationNotificationInteractor;
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
        {
          provide: CreateNewAssignationNotificationInteractor,
          useValue: mockCreateAssignationNotif,
        },
        {
          provide: ReadNotificationInteractor,
          useValue: mockReadNotifUsecase,
        },
        {
          provide: GetNewNotificationsInteractor,
          useValue: {},
        },
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
        .spyOn(mockReadNotifUsecase, 'readNotification')
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
