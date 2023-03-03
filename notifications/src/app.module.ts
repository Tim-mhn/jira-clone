import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentNotificationRepository } from './infrastructure/repositories/comment-notification-repository/comment-notification.repository';
import { TaskFollowersRepository } from './infrastructure/repositories/task-followers-repository/task-followers.repository';
import { AuthModule, GlobalAuthGuardProvider } from './auth';
import { ConfigModule } from '@nestjs/config';

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
    AppService,
    CommentNotificationRepository,
    TaskFollowersRepository,
  ],
})
export class AppModule {}
