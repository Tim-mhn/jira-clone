import { Provider } from '@nestjs/common';
import { JSONCommentNotificationRepository } from '../repositories/comment-notification-repository/comment-notification.repository';

export const CommentNotificationRepositoryToken =
  'CommentNotificationRepositoryToken';

export const CommentNotificationRepositoryProvider: Provider = {
  provide: CommentNotificationRepositoryToken,
  useClass: JSONCommentNotificationRepository,
};
