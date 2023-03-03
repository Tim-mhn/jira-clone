import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { FollowTaskDTO } from './infrastructure/dtos/follow-task.dto';
import { NewCommentDTO } from './infrastructure/dtos/new-comment.dto';
import { NotificationReadDTO } from './infrastructure/dtos/notification-read.dto';
import { NewCommentNotification } from './domain/models/new-comment-notification';
import { CommentNotificationRepository } from './infrastructure/repositories/comment-notification-repository/comment-notification.repository';
import { TaskFollowersRepository } from './infrastructure/repositories/task-followers-repository/task-followers.repository';
import { AuthenticatedRequest } from './auth';

@Controller()
export class AppController {
  constructor(
    private repo: CommentNotificationRepository,
    private followersRepo: TaskFollowersRepository,
  ) {}

  @Get()
  getRoot(): string {
    return 'Notifications API';
  }

  @Get('/notifications')
  getNewCommentNotifications(
    @Request() req: AuthenticatedRequest,
  ): Promise<NewCommentNotification[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.log('User = ', req.user);
    const userId = req.user.Id;
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
