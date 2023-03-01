import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { FollowTaskDTO } from './dtos/follow-task.dto';
import { NewCommentDTO } from './dtos/new-comment.dto';
import { NotificationReadDTO } from './dtos/notification-read.dto';
import { NewCommentNotification } from './models/new-comment-notification';
import { CommentNotificationRepository } from './repositories/comment-notification-repository/comment-notification.repository';
import { TaskFollowersRepository } from './repositories/task-followers-repository/task-followers.repository';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private repo: CommentNotificationRepository,
    private followersRepo: TaskFollowersRepository,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/notifications')
  getNewCommentNotifications(
    @Query('userId') userId: string,
  ): NewCommentNotification[] {
    return this.repo.getNewCommentNotifications(userId);
  }

  @Post('/follow')
  followTask(@Body() followTaskDTO: FollowTaskDTO) {
    console.log('FOLLOW CALLED with ', followTaskDTO);
    this.followersRepo.markUserAsFollowerOfTask(
      followTaskDTO.userId,
      followTaskDTO.taskId,
    );
  }

  @Post('/comment')
  createNewCommentNotification(@Body() newCommentDTO: NewCommentDTO) {
    console.log('COMMENT CALLED with ', newCommentDTO);

    this.repo.createNewCommentNotification(newCommentDTO);
  }

  @Post('/read')
  userReadNotification(@Body() notificationReadDTO: NotificationReadDTO) {
    this.repo.markNotificationAsReadByUser(notificationReadDTO);
  }
}
