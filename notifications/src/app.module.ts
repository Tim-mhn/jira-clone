import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TaskFollowersRepository } from './notifications/infrastructure/repositories/task-followers-repository/task-followers.repository';
import { AuthModule, GlobalAuthGuardProvider } from './auth';
import { ConfigModule } from '@nestjs/config';
import { TaskAssignationNotificationRepositoryProvider } from './notifications/infrastructure/providers';
import { CreateNewAssignationNotificationInteractor } from './notifications/application/use-cases/create-new-assignation-notification/create-new-assignation-notification.interactor';
import { GetNewNotificationsInteractor } from './notifications/application/use-cases/get-new-notifications/get-new-notifications.interactor';
import { ReadNotificationInteractor } from './notifications/application/use-cases/read-notification/read-notification.interactor';
import { CommentNotificationRepositoryProvider } from './notifications/infrastructure/providers/comment-notification-repository.provider';
import { CreateCommentNotificationsInteractor } from './notifications/application/use-cases/create-comment-notifications/create-comment-notifications.interactor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    GlobalAuthGuardProvider,
    CommentNotificationRepositoryProvider,
    TaskFollowersRepository,
    TaskAssignationNotificationRepositoryProvider,
    CreateNewAssignationNotificationInteractor,
    GetNewNotificationsInteractor,
    ReadNotificationInteractor,
    CreateCommentNotificationsInteractor,
  ],
})
export class AppModule {}
