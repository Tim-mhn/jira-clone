import { CommentNotificationRepository } from '../repositories/comment-notification.repository';

export function getMockCommentNotificationsRepository(): CommentNotificationRepository {
  const mockCommentNotifsRepo: CommentNotificationRepository = {
    readNotification: jest.fn(),
    getNewCommentNotifications: jest.fn(),
    createNewCommentNotifications: jest.fn(),
  } as any as CommentNotificationRepository;

  return mockCommentNotifsRepo;
}
