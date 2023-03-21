import { CommentNotificationsRepository } from '../repositories/comment-notification.repository';

export function getMockCommentNotificationsRepository(): CommentNotificationsRepository {
  const mockCommentNotifsRepo: CommentNotificationsRepository = {
    readNotification: jest.fn(),
    getCommentNotifications: jest.fn(),
    createCommentNotifications: jest.fn(),
  } as any as CommentNotificationsRepository;

  return mockCommentNotifsRepo;
}
