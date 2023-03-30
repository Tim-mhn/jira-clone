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
import { AuthenticatedRequest } from './auth';
import { Response } from 'express';
import {
  FollowTaskDTO,
  ReadNotificationDTO,
} from './notifications/infrastructure/dtos';
import {
  NotificationNotFound,
  NotificationReadEvent,
} from './notifications/domain';
import { GetNewNotificationsInteractor } from './notifications/application/use-cases/get-new-notifications/get-new-notifications.interactor';
import { AllNotifications } from './notifications/domain/models/all-notifications';
import { ReadNotificationInteractor } from './notifications/application/use-cases/read-notification/read-notification.interactor';
import { TaskFollowersRepositoryToken } from './notifications/infrastructure/providers/task-followers-repository.provider';
import { TaskFollowersRepository } from './notifications/domain/repositories';

@Controller()
export class AppController {
  constructor(
    @Inject(TaskFollowersRepositoryToken)
    private followersRepo: TaskFollowersRepository,
    private getNewNotificationsInteractor: GetNewNotificationsInteractor,
    private readNotificationInteractor: ReadNotificationInteractor,
  ) {}

  @Get()
  getRoot(): string {
    return 'Tim Jira Notifications API';
  }

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
    @Request() req: AuthenticatedRequest,
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
