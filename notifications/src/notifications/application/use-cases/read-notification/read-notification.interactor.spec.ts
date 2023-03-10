/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationReadEvent } from '../../../domain';
import { NotificationType } from '../../../domain/models/notification';
import { TaskAssignationNotificationRepository } from '../../../domain/repositories/assignation-notification.repository';
import { TaskAssignationNotificationRepositoryToken } from '../../../infrastructure/providers';
import { CommentNotificationRepository } from '../../../infrastructure/repositories/comment-notification-repository/comment-notification.repository';
import { ReadNotificationInteractor } from './read-notification.interactor';

describe('ReadNotificationService', () => {
  let service: ReadNotificationInteractor;

  const mockCommentNotifsRepo: CommentNotificationRepository = {
    markNotificationAsReadByUser: jest.fn(),
  } as any as CommentNotificationRepository;

  const mockTaskAssignationRepo: TaskAssignationNotificationRepository = {
    markNotificationAsRead: jest.fn(),
    create: jest.fn(),
  } as TaskAssignationNotificationRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReadNotificationInteractor,
        {
          provide: CommentNotificationRepository,
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

  it('should call CommentNotificationRepository if the notification type is COMMENT', async () => {
    const notifId = 'xyz-123-notif';
    const notificationRead: NotificationReadEvent = {
      followerId: 'acaeceac',
      notificationId: notifId,
      notificationType: NotificationType.COMMENT,
    };

    jest
      .spyOn(mockCommentNotifsRepo, 'markNotificationAsReadByUser')
      .mockImplementation(async () => await null);

    await service.readNotification(notificationRead);

    expect(
      mockCommentNotifsRepo.markNotificationAsReadByUser,
    ).toHaveBeenCalled();
  });

  it('should call TaskAssignationRepository if the notification type is ASSIGNATION', async () => {
    const notifId = 'xyz-123-notif';
    const notificationRead: NotificationReadEvent = {
      followerId: 'acaeceac',
      notificationId: notifId,
      notificationType: NotificationType.ASSIGNATION,
    };

    jest
      .spyOn(mockTaskAssignationRepo, 'markNotificationAsRead')
      .mockImplementation(async () => await null);

    await service.readNotification(notificationRead);

    expect(mockTaskAssignationRepo.markNotificationAsRead).toHaveBeenCalled();
  });
});
