import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ReadNotificationDTO } from '../dtos/read-notification.dto';
import { NotificationsProvidersModule } from '../notifications-providers.module';
import {
  CommentNotificationDTO,
  NewNotificationsDTO,
  TaskAssignationNotificationDTO,
} from '../dtos/new-notifications.dto';

@Injectable({
  providedIn: NotificationsProvidersModule,
})
export class NotificationsAPI {
  constructor(private http: HttpClient) {}

  private endpoint = `${environment.notificationsUrl}notifications`;
  private readEndpoint = `${environment.notificationsUrl}read`;
  public getNewNotifications() {
    const endpoint = `${this.endpoint}`;
    return this.http.get<NewNotificationsDTO>(endpoint);
  }

  public getRealTimeNewNotificationsStream() {
    const endpoint = `${environment.notificationsUrl}notifications/events`;
    const source = new EventSource(endpoint, { withCredentials: true });
    return fromEventSource<
      CommentNotificationDTO | TaskAssignationNotificationDTO
    >(source);
  }

  public readNotification(dto: ReadNotificationDTO) {
    return this.http.post<void>(this.readEndpoint, dto);
  }
}

function fromEventSource<T>(es: EventSource) {
  return new Observable<T>((observer) => {
    es.addEventListener('message', (messageEvent: MessageEvent<string>) => {
      observer.next(JSON.parse(messageEvent.data) as T);
    });

    es.addEventListener('error', (err) => observer.error(err));
  });
}
