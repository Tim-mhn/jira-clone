import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Request,
  Res,
} from '@nestjs/common';
import { NewCommentNotification } from './notifications/domain/models/new-comment-notification';
import { CommentNotificationRepository } from './notifications/infrastructure/repositories/comment-notification-repository/comment-notification.repository';
import { TaskFollowersRepository } from './notifications/infrastructure/repositories/task-followers-repository/task-followers.repository';
import { AuthenticatedRequest } from './auth';
import { Response } from 'express';
import { NotificationNotFound } from './notifications/domain/errors/notification-not-found.error';
import {
  AssignationNotificationDTO,
  FollowTaskDTO,
  NewCommentDTO,
  ReadNotificationDTO,
} from './notifications/infrastructure/dtos';
import { TaskAssignationNotificationRepositoryToken } from './notifications/infrastructure/providers';
import { CreateNewAssignationNotificationInteractor } from './notifications/application/use-cases/create-new-assignation-notification/create-new-assignation-notification.interactor';
import { TaskAssignedEvent } from './notifications/domain';

@Controller()
export class AppController {
  constructor(
    private repo: CommentNotificationRepository,
    private followersRepo: TaskFollowersRepository,
    @Inject(TaskAssignationNotificationRepositoryToken)
    private createAssignationNotificationInteractor: CreateNewAssignationNotificationInteractor,
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

  @Post('/comment')
  createNewCommentNotification(@Body() newCommentDTO: NewCommentDTO) {
    this.repo.createNewCommentNotification(newCommentDTO);
  }

  @Post('/assignation')
  createNewAssignationNotification(
    @Body() dto: AssignationNotificationDTO,
    @Request() authRequest: AuthenticatedRequest,
  ) {
    const userId = authRequest?.user?.id;

    const taskAssignedEvent: TaskAssignedEvent = {
      assignerId: userId,
      ...dto,
    };

    return this.createAssignationNotificationInteractor.handle(
      taskAssignedEvent,
    );
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
