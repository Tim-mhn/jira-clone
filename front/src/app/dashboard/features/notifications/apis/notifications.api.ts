import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ReadNotificationDTO } from '../dtos/read-notification.dto';
import { NewCommentNotification } from '../models/new-comment-notification';
import { NotificationsProvidersModule } from '../notifications-providers.module';

@Injectable({
  providedIn: NotificationsProvidersModule,
})
export class NotificationsAPI {
  constructor(private http: HttpClient) {}

  private endpoint = `${environment.notificationsUrl}notifications`;
  private readEndpoint = `${environment.notificationsUrl}read`;
  public getNewCommentNotifications() {
    const endpoint = `${this.endpoint}`;
    return this.http.get<NewCommentNotification[]>(endpoint);
  }

  public readNotification(dto: ReadNotificationDTO) {
    return this.http.post<void>(this.readEndpoint, dto);
  }
}
