import { Provider } from '@nestjs/common';
import { DBCommentNotificationsRepository } from '../repositories/comment-notifications-repository/comment-notifications.repository';

export const CommentNotificationsRepositoryToken =
  'CommentNotificationsRepositoryToken';

export const CommentNotificationsRepositoryProvider: Provider = {
  provide: CommentNotificationsRepositoryToken,
  useClass: DBCommentNotificationsRepository,
};
