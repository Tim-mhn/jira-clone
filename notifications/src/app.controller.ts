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
import { TaskFollowersRepository } from './notifications/infrastructure/repositories/task-followers-repository/task-followers.repository';
import { AuthenticatedRequest } from './auth';
import { Response } from 'express';
import {
  AssignationNotificationDTO,
  FollowTaskDTO,
  NewCommentDTO,
  ReadNotificationDTO,
} from './notifications/infrastructure/dtos';
import { CreateNewAssignationNotificationInteractor } from './notifications/application/use-cases/create-new-assignation-notification/create-new-assignation-notification.interactor';
import {
  NotificationNotFound,
  NotificationReadEvent,
  TaskAssignedEvent,
} from './notifications/domain';
import { GetNewNotificationsInteractor } from './notifications/application/use-cases/get-new-notifications/get-new-notifications.interactor';
import { AllNotifications } from './notifications/domain/models/all-notifications';
import { ReadNotificationInteractor } from './notifications/application/use-cases/read-notification/read-notification.interactor';
import { CreateCommentNotificationsInteractor } from './notifications/application/use-cases/create-comment-notifications/create-comment-notifications.interactor';

@Controller()
export class AppController {
  constructor(
    private followersRepo: TaskFollowersRepository,
    private createAssignationNotificationInteractor: CreateNewAssignationNotificationInteractor,
    private getNewNotificationsInteractor: GetNewNotificationsInteractor,
    private readNotificationInteractor: ReadNotificationInteractor,
    private createCommentNotificationsInteractor: CreateCommentNotificationsInteractor,
  ) {}

  @Get()
  getRoot(): string {
    return 'Notifications API';
  }

  @Get('/notifications')
  getNewCommentNotifications(
    @Request() req: AuthenticatedRequest,
  ): Promise<AllNotifications> {
    const userId = req.user.id;
    return this.getNewNotificationsInteractor.getNewNotifications(userId);
  }

  @Post('/follow')
  followTask(@Body() followTaskDTO: FollowTaskDTO) {
    this.followersRepo.markUserAsFollowerOfTask(
      followTaskDTO.userId,
      followTaskDTO.taskId,
    );
  }

  @Post('/comment')
  createNewCommentNotifications(@Body() newCommentDTO: NewCommentDTO) {
    this.createCommentNotificationsInteractor.createNotificationsForTaskFollowersExceptCommentAuthor(
      newCommentDTO,
    );
  }

  // TODO: - cancel previous assignation notifications of that task
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
      const notificationReadEvent: NotificationReadEvent = {
        notificationId: notificationReadDTO.notificationId,
        notificationType: notificationReadDTO.type,
      };

      await this.readNotificationInteractor.readNotification(
        notificationReadEvent,
      );
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
