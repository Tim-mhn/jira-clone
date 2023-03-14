/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationReadEvent } from '../../../domain';
import { getMockCommentNotificationsRepository } from '../../../domain/mocks';
import { NotificationType } from '../../../domain/models/notification';
import { TaskAssignationNotificationRepository } from '../../../domain/repositories/assignation-notification.repository';
import { TaskAssignationNotificationRepositoryToken } from '../../../infrastructure/providers';
import { CommentNotificationsRepositoryToken } from '../../../infrastructure/providers/comment-notification-repository.provider';
import { ReadNotificationInteractor } from './read-notification.interactor';

describe('ReadNotificationService', () => {
  let service: ReadNotificationInteractor;

  const mockCommentNotifsRepo = getMockCommentNotificationsRepository();

  const mockTaskAssignationRepo: TaskAssignationNotificationRepository = {
    readNotification: jest.fn(),
    create: jest.fn(),
    getNewNotifications: jest.fn(),
    dismissNotificationsFromTask: jest.fn(),
  } as TaskAssignationNotificationRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReadNotificationInteractor,
        {
          provide: CommentNotificationsRepositoryToken,
          useValue: mockCommentNotifsRepo,
        },
        {
          provide: TaskAssignationNotificationRepositoryToken,
          useValue: mockTaskAssignationRepo,
        },
      ],
    }).compile();

    service = module.get<ReadNotificationInteractor>(
      ReadNotificationInteractor,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call CommentNotificationsRepository if the notification type is COMMENT', async () => {
    const notifId = 'xyz-123-notif';
    const notificationRead: NotificationReadEvent = {
      notificationId: notifId,
      notificationType: NotificationType.COMMENT,
    };

    jest
      .spyOn(mockCommentNotifsRepo, 'readNotification')
      .mockImplementation(async () => await null);

    await service.readNotification(notificationRead);

    expect(mockCommentNotifsRepo.readNotification).toHaveBeenCalled();
  });

  it('should call TaskAssignationRepository if the notification type is ASSIGNATION', async () => {
    const notifId = 'xyz-123-notif';
    const notificationRead: NotificationReadEvent = {
      notificationId: notifId,
      notificationType: NotificationType.ASSIGNATION,
    };

    jest
      .spyOn(mockTaskAssignationRepo, 'readNotification')
      .mockImplementation(async () => await null);

    await service.readNotification(notificationRead);

    expect(mockTaskAssignationRepo.readNotification).toHaveBeenCalled();
  });
});
