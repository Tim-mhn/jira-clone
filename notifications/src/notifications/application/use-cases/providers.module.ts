import { Module } from '@nestjs/common';
import { NotificationsRepositoriesProvidersModule } from '../../adapter/providers/providers.module';
import { CreateCommentNotificationsInteractor } from './create-comment-notifications/create-comment-notifications.interactor';
import { CreateNewAssignationNotificationInteractor } from './create-new-assignation-notification/create-new-assignation-notification.interactor';
import { GetNewNotificationsInteractor } from './get-new-notifications/get-new-notifications.interactor';
import { ReadNotificationInteractor } from './read-notification/read-notification.interactor';
import { NewNotificationEmitter } from '../emitters/new-notification.emitter';

@Module({
  imports: [NotificationsRepositoriesProvidersModule],
  providers: [
    ReadNotificationInteractor,
    GetNewNotificationsInteractor,
    CreateNewAssignationNotificationInteractor,
    CreateCommentNotificationsInteractor,
    NewNotificationEmitter,
  ],
  exports: [
    NotificationsRepositoriesProvidersModule,
    ReadNotificationInteractor,
    GetNewNotificationsInteractor,
    CreateNewAssignationNotificationInteractor,
    CreateCommentNotificationsInteractor,
    NewNotificationEmitter,
  ],
})
export class NotificationsInteractorsProvidersModule {}
