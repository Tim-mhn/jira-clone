import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { NewCommentNotification } from './models/new-comment-notification';
import { CommentNotificationRepository } from './repositories/comment-notification-repository/comment-notification.repository';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private repo: CommentNotificationRepository,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/notifications')
  getNewCommentNotifications(): NewCommentNotification[] {
    return this.repo.getNewCommentNotifications();
  }
}
