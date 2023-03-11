import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommentNotificationRepository } from './notifications/infrastructure/repositories/comment-notification-repository/comment-notification.repository';
import { TaskFollowersRepository } from './notifications/infrastructure/repositories/task-followers-repository/task-followers.repository';
import { AuthModule, GlobalAuthGuardProvider } from './auth';
import { ConfigModule } from '@nestjs/config';
import { TaskAssignationNotificationRepositoryProvider } from './notifications/infrastructure/providers';
import { CreateNewAssignationNotificationInteractor } from './notifications/application/use-cases/create-new-assignation-notification/create-new-assignation-notification.interactor';
import { GetNewNotificationsInteractor } from './notifications/application/use-cases/get-new-notifications/get-new-notifications.interactor';

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
    CommentNotificationRepository,
    TaskFollowersRepository,
    TaskAssignationNotificationRepositoryProvider,
    CreateNewAssignationNotificationInteractor,
    GetNewNotificationsInteractor,
  ],
})
export class AppModule {}
