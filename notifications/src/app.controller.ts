import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
} from '@nestjs/common';
import { FollowTaskDTO } from './infrastructure/dtos/follow-task.dto';
import { NewCommentDTO } from './infrastructure/dtos/new-comment.dto';
import { ReadNotificationDTO } from './infrastructure/dtos/read-notification.dto';
import { NewCommentNotification } from './domain/models/new-comment-notification';
import { CommentNotificationRepository } from './infrastructure/repositories/comment-notification-repository/comment-notification.repository';
import { TaskFollowersRepository } from './infrastructure/repositories/task-followers-repository/task-followers.repository';
import { AuthenticatedRequest } from './auth';
import { Response } from 'express';
import { NotificationNotFound } from './domain/errors/notification-not-found.error';

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
    const userId = req.user.id;
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

  //todo: add validation on new comment DTO since project seems to be missing
  @Post('/comment')
  createNewCommentNotification(@Body() newCommentDTO: NewCommentDTO) {
    this.repo.createNewCommentNotification(newCommentDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/read')
  async userReadNotification(
    @Request() req: AuthenticatedRequest,
    @Body() notificationReadDTO: ReadNotificationDTO,
    @Res({ passthrough: true }) _response?: Response,
  ) {
    try {
      const currentUserId = req.user.id;

      const { notificationId } = notificationReadDTO;

      await this.repo.markNotificationAsReadByUser({
        followerId: currentUserId,
        notificationId,
      });
    } catch (err) {
      if (err instanceof NotificationNotFound) {
        _response.status(HttpStatus.NOT_FOUND).send({
          message: err.message,
          error: 'NotificationNotFound',
        });
        return;
      }

      _response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
        error: 'InternalServerError',
      });

      return {};
    }
  }
}
