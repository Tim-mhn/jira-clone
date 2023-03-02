import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { NewCommentNotification } from '../models/new-comment-notification';
import { NotificationsProvidersModule } from '../notifications-providers.module';

@Injectable({
  providedIn: NotificationsProvidersModule,
})
export class NotificationsAPI {
  constructor(private http: HttpClient) {}

  private endpoint = `${environment.notificationsUrl}notifications`;
  public getNewCommentNotifications(currentUserId: string) {
    const endpoint = `${this.endpoint}?userId=${currentUserId}`;
    return this.http.get<NewCommentNotification[]>(endpoint);
  }
}
