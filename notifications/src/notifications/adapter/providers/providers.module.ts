import { Module } from '@nestjs/common';
import { CommentNotificationsRepositoryProvider } from './comment-notification-repository.provider';
import { TaskAssignationNotificationsRepositoryProvider } from './task-assignation-notification-repository.provider';
import { TaskFollowersRepositoryProvider } from './task-followers-repository.provider';

@Module({
  providers: [
    TaskAssignationNotificationsRepositoryProvider,
    TaskFollowersRepositoryProvider,
    CommentNotificationsRepositoryProvider,
  ],
  exports: [
    TaskAssignationNotificationsRepositoryProvider,
    TaskFollowersRepositoryProvider,
    CommentNotificationsRepositoryProvider,
  ],
})
export class NotificationsRepositoriesProvidersModule {}
