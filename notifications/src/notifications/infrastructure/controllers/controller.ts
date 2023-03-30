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
import { Response } from 'express';
import { AuthenticatedRequest } from '../../../auth';
import { GetNewNotificationsInteractor } from '../../application/use-cases/get-new-notifications/get-new-notifications.interactor';
import { ReadNotificationInteractor } from '../../application/use-cases/read-notification/read-notification.interactor';
import { NotificationNotFound, NotificationReadEvent } from '../../domain';
import { AllNotifications } from '../../domain/models/all-notifications';
import { FollowTaskDTO, ReadNotificationDTO } from '../dtos';
import { TaskFollowersRepositoryToken } from '../../adapter/providers/task-followers-repository.provider';
import { TaskFollowersRepository } from '../repositories/task-followers-repository/task-followers.repository';

@Controller()
export class NotificationsController {
  constructor(
    @Inject(TaskFollowersRepositoryToken)
    private followersRepo: TaskFollowersRepository,
    private getNewNotificationsInteractor: GetNewNotificationsInteractor,
    private readNotificationInteractor: ReadNotificationInteractor,
  ) {}

  @Get('/notifications')
  getCommentNotifications(
    @Request() req: AuthenticatedRequest,
  ): Promise<AllNotifications> {
    const userId = req.user.id;
    return this.getNewNotificationsInteractor.getUserCommentNotifications(
      userId,
    );
  }

  @Post('/follow')
  followTask(@Body() followTaskDTO: FollowTaskDTO) {
    this.followersRepo.markUserAsFollowerOfTask(
      followTaskDTO.userId,
      followTaskDTO.taskId,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('/read')
  async userReadNotification(
    @Request() _req: AuthenticatedRequest,
    @Body() notificationReadDTO: ReadNotificationDTO,
    @Res({ passthrough: true }) _response?: Response,
  ) {
    try {
      const notificationReadEvent: NotificationReadEvent = {
        notificationId: notificationReadDTO.id,
        notificationType: notificationReadDTO.type,
      };

      await this.readNotificationInteractor.handle(notificationReadEvent);
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
