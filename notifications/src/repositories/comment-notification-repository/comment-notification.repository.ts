import { Injectable, Scope } from '@nestjs/common';
import { NewCommentNotification } from '../../models/new-comment-notification';

const NEW_COMMENTS_NOTIFS: NewCommentNotification[] = [
  {
    author: {
      id: 'aceace',
      name: 'Bob',
    },
    comment: 'comment',
    project: {
      id: '75a4ca83-2f38-47c5-96f0-20838d93a368',
      name: 'project',
    },
    taskId: 'f270c266-de27-4ecd-b18b-10f7c2ad8ad6',
  },
];

@Injectable({ scope: Scope.DEFAULT })
export class CommentNotificationRepository {
  getNewCommentNotifications(): NewCommentNotification[] {
    return NEW_COMMENTS_NOTIFS;
  }
}
