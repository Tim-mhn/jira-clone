import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { NotificationsAPI } from '../apis/notifications.api';
import { NotificationsMapper } from '../mappers/notifications.mapper';
import { CommentNotification, NotificationType } from '../models';
import { NotificationsController } from './notifications.controller';

describe('NotificationsController', () => {
  let spyApi: jasmine.SpyObj<NotificationsAPI>;

  let router: jasmine.SpyObj<Router>;

  let controller: NotificationsController;

  const mapper = new NotificationsMapper();

  beforeEach(() => {
    spyApi = jasmine.createSpyObj('NotificationsAPI', ['readNotification']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    controller = new NotificationsController(spyApi, router, mapper);
  });

  it('should call api.readNotification with the correct input', () => {
    const notif = new CommentNotification({
      id: 'notification-id',
      project: {
        id: 'project id',
        name: 'project name',
      },
      comment: '',
      author: null,
      type: NotificationType.COMMENT,
      task: {
        id: 'task-id',
        name: 'task-name',
      },
    });

    spyApi.readNotification.and.returnValue(EMPTY);
    controller.goToTaskPageAndMarkNotificationAsRead(notif);

    expect(spyApi.readNotification).toHaveBeenCalledWith({
      id: notif.id,
      type: NotificationType.COMMENT,
    });
  });
});
