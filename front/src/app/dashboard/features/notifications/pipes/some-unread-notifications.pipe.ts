import { Pipe, PipeTransform } from '@angular/core';
import { NewNotifications } from '../models';

@Pipe({
  name: 'someUnreadNotifications',
})
export class SomeUnreadNotificationsPipe implements PipeTransform {
  transform(notifications: NewNotifications): unknown {
    return notifications?.some((n) => !n?.read);
  }
}
