import { CommentNotificationRepository } from '../repositories/comment-notification.repository';

export function getMockCommentNotificationsRepository(): CommentNotificationRepository {
  const mockCommentNotifsRepo: CommentNotificationRepository = {
    markNotificationAsReadByUser: jest.fn(),
    getNewCommentNotifications: jest.fn(),
    createNewCommentNotifications: jest.fn(),
  } as any as CommentNotificationRepository;

  return mockCommentNotifsRepo;
}
