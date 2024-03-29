import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { TaskAssignedEvent } from '../../domain';
import { NewCommentEvent } from '../../domain/events/new-comment.event';
import {
  NewCommentExchangeName,
  TaskAssignedExchangeName,
} from './exchange-names';
import { CreateCommentNotificationsInteractor } from '../../application/use-cases/create-comment-notifications/create-comment-notifications.interactor';
import { CreateNewAssignationNotificationInteractor } from '../../application/use-cases/create-new-assignation-notification/create-new-assignation-notification.interactor';

@Injectable()
export class TasksEventsSubscriber {
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
