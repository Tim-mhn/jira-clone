import { Injectable } from '@angular/core';
import { NotificationsAPI } from '../apis/notifications.api';
import { NotificationsProvidersModule } from '../notifications-providers.module';

@Injectable({
  providedIn: NotificationsProvidersModule,
})
export class NotificationsController {
  constructor(private api: NotificationsAPI) {}

  public getNewNotificationsForCurrentUser() {
    return this.api.getNewCommentNotifications();
  }
}
