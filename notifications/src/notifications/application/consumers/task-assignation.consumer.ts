import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { TaskAssignedEvent } from '../../domain';
import { NewCommentEvent } from '../../domain/events/new-comment.event';
import {
  NewCommentExchangeName,
  TaskAssignedExchangeName,
} from '../../infrastructure/message-queue/exchange-names';
import { CreateCommentNotificationsInteractor } from '../use-cases/create-comment-notifications/create-comment-notifications.interactor';
import { CreateNewAssignationNotificationInteractor } from '../use-cases/create-new-assignation-notification/create-new-assignation-notification.interactor';

@Injectable()
export class TasksEventsConsumer {
  constructor(
    private createAssignationNotificationInteractor: CreateNewAssignationNotificationInteractor,
    private commentNotificationsInteractor: CreateCommentNotificationsInteractor,
  ) {}

  @RabbitSubscribe({
    exchange: TaskAssignedExchangeName,
    routingKey: '',
  })
  public async handleNewTaskAssignedEvent(event: TaskAssignedEvent) {
    this.createAssignationNotificationInteractor.handle(event);
  }

  @RabbitSubscribe({
    exchange: NewCommentExchangeName,
    routingKey: '',
  })
  public async handleNewTaskComment(event: NewCommentEvent) {
    this.commentNotificationsInteractor.createNotificationsForTaskFollowersExceptCommentAuthor(
      event,
    );
  }
}
