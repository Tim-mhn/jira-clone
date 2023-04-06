/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { createMocks } from 'node-mocks-http';
import { HttpStatus } from '@nestjs/common';
import { NotificationsController } from './controller';
import { CommentNotificationsRepository } from '../../domain/repositories';
import { ReadNotificationInteractor } from '../../application/use-cases/read-notification/read-notification.interactor';
import { TaskFollowersRepository } from '../repositories/task-followers-repository/task-followers.repository';
import { CommentNotificationsRepositoryToken } from '../../adapter/providers';
import { TaskFollowersRepositoryToken } from '../../adapter/providers/task-followers-repository.provider';
import { CreateNewAssignationNotificationInteractor } from '../../application/use-cases/create-new-assignation-notification/create-new-assignation-notification.interactor';
import { GetNewNotificationsInteractor } from '../../application/use-cases/get-new-notifications/get-new-notifications.interactor';
import { CreateCommentNotificationsInteractor } from '../../application/use-cases/create-comment-notifications/create-comment-notifications.interactor';
import { NotificationNotFound } from '../../domain';
import { ReadNotificationDTO } from '../dtos';
import { AuthenticatedRequest } from '../../../auth';
import { NewNotificationEmitter } from '../../application/emitters/new-notification.emitter';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  const mockRepo = {} as CommentNotificationsRepository;
  mockRepo.readNotification = jest.fn();

  const mockReadNotifUsecase: ReadNotificationInteractor = {
    handle: jest.fn(),
  } as any as ReadNotificationInteractor;

  const mockFollowersRepo = {} as TaskFollowersRepository;

  const mockCreateAssignationNotif =
    {} as CreateNewAssignationNotificationInteractor;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: CommentNotificationsRepositoryToken,
          useValue: mockRepo,
        },
        {
          provide: TaskFollowersRepositoryToken,
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
        {
          provide: CreateCommentNotificationsInteractor,
          useValue: {},
        },
        NewNotificationEmitter,
      ],
    }).compile();
    controller = app.get<NotificationsController>(NotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST read', () => {
    it('should return a NotFound error if the repo returns a NotificationNotFound error', async () => {
      const notifId = 'notif-id';

      const { req, res } = createMocks();

      jest
        .spyOn(mockReadNotifUsecase, 'handle')
        .mockImplementationOnce(async () => {
          throw new NotificationNotFound(notifId);
        });

      const dto = new ReadNotificationDTO();
      dto.id = notifId;

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
