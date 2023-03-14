import { CommentNotificationsRepository } from '../repositories/comment-notification.repository';

export function getMockCommentNotificationsRepository(): CommentNotificationsRepository {
  const mockCommentNotifsRepo: CommentNotificationsRepository = {
    readNotification: jest.fn(),
    getNewCommentNotifications: jest.fn(),
    createNewCommentNotifications: jest.fn(),
  } as any as CommentNotificationsRepository;

  return mockCommentNotifsRepo;
}
