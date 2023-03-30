import { Module } from '@nestjs/common';
import { TasksEventsConsumer } from './application/consumers/task-assignation.consumer';
import { CreateCommentNotificationsInteractor } from './application/use-cases/create-comment-notifications/create-comment-notifications.interactor';
import { CreateNewAssignationNotificationInteractor } from './application/use-cases/create-new-assignation-notification/create-new-assignation-notification.interactor';
import { GetNewNotificationsInteractor } from './application/use-cases/get-new-notifications/get-new-notifications.interactor';
import { ReadNotificationInteractor } from './application/use-cases/read-notification/read-notification.interactor';
import { NotificationsRabbitMQModule } from './infrastructure/message-queue/module';
import {
  CommentNotificationsRepositoryProvider,
  TaskAssignationNotificationsRepositoryProvider,
} from './infrastructure/providers';
import { TaskFollowersRepositoryProvider } from './infrastructure/providers/task-followers-repository.provider';

@Module({
  imports: [NotificationsRabbitMQModule],
  providers: [
    CommentNotificationsRepositoryProvider,
    TaskFollowersRepositoryProvider,
    TaskAssignationNotificationsRepositoryProvider,
    CreateNewAssignationNotificationInteractor,
    GetNewNotificationsInteractor,
    ReadNotificationInteractor,
    CreateCommentNotificationsInteractor,
    TasksEventsConsumer,
  ],
  exports: [
    CommentNotificationsRepositoryProvider,
    TaskFollowersRepositoryProvider,
    TaskAssignationNotificationsRepositoryProvider,
    CreateNewAssignationNotificationInteractor,
    GetNewNotificationsInteractor,
    ReadNotificationInteractor,
    CreateCommentNotificationsInteractor,
  ],
})
export class NotificationsModule {}
