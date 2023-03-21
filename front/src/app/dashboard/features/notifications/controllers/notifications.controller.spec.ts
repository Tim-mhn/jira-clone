import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { NotificationsAPI } from '../apis/notifications.api';
import { Notification, NotificationType } from '../models';
import { NotificationsController } from './notifications.controller';

describe('NotificationsController', () => {
  let spyApi: jasmine.SpyObj<NotificationsAPI>;

  let router: jasmine.SpyObj<Router>;

  let controller: NotificationsController;

  beforeEach(() => {
    spyApi = jasmine.createSpyObj('NotificationsAPI', ['readNotification']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    controller = new NotificationsController(spyApi, router);
  });

  it('should call api.readNotification with the correct input', () => {
    const notif: Notification<NotificationType.COMMENT> = {
      id: 'notification-id',
      project: {
        id: 'project id',
        name: 'project name',
      },
      type: NotificationType.COMMENT,
      task: {
        id: 'task-id',
        name: 'task-name',
      },
    };

    spyApi.readNotification.and.returnValue(EMPTY);
    controller.goToTaskPageAndMarkNotificationAsRead(notif);

    expect(spyApi.readNotification).toHaveBeenCalledWith({
      id: notif.id,
      type: NotificationType.COMMENT,
    });
  });
});
