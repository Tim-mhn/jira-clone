import { Pipe, PipeTransform } from '@angular/core';
import { logMethod } from '../../../../shared/utils/log-method.decorator';
import { NewNotifications } from '../models';

@Pipe({
  name: 'someUnreadNotifications',
})
export class SomeUnreadNotificationsPipe implements PipeTransform {
  @logMethod
  transform(notifications: NewNotifications): unknown {
    return notifications?.some((n) => !n?.read);
  }
}
