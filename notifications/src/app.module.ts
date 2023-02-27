import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentNotificationRepository } from './repositories/comment-notification-repository/comment-notification.repository';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, CommentNotificationRepository],
})
export class AppModule {}
