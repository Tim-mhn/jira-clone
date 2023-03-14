import { Provider } from '@nestjs/common';
import { DBCommentNotificationsRepositoryService } from '../repositories/comment-notifications-repository/comment-notifications-repository.service';

export const CommentNotificationsRepositoryToken =
  'CommentNotificationsRepositoryToken';

export const CommentNotificationsRepositoryProvider: Provider = {
  provide: CommentNotificationsRepositoryToken,
  useClass: DBCommentNotificationsRepositoryService,
};
