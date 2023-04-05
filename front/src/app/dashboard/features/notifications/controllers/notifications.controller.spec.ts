import { Router } from '@angular/router';
import { EMPTY, Subject, of, take } from 'rxjs';
import { NotificationsAPI } from '../apis/notifications.api';
import { NotificationsMapper } from '../mappers/notifications.mapper';
import { CommentNotification, NotificationType } from '../models';
import { NotificationsController } from './notifications.controller';
import {
  NewNotificationsDTO,
  TaskAssignationNotificationDTO,
} from '../dtos/new-notifications.dto';

describe('NotificationsController', () => {
  let spyApi: jasmine.SpyObj<NotificationsAPI>;

  let router: jasmine.SpyObj<Router>;

  let controller: NotificationsController;

  const mapper = new NotificationsMapper();

  beforeEach(() => {
    spyApi = jasmine.createSpyObj('NotificationsAPI', [
      'readNotification',
      'getRealTimeNewNotificationsStream',
      'getNewNotifications',
    ]);
    router = jasmine.createSpyObj('Router', ['navigate']);
    controller = new NotificationsController(spyApi, router, mapper);
  });

  describe('goToTaskPageAndMarkNotificationAsRead', () => {
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
          title: 'task-name',
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

  describe('getNewNotificationsForCurrentUser', () => {
    const firstListOfNotifications: NewNotificationsDTO = [
      createMockNotificationDTO('notif-1'),
      createMockNotificationDTO('notif-2'),
    ];
    it('after api.getNewNotifications has completed, if the EventSource emits a new notification, it should emit a new list of notifications with the new notification first', () => {
      const newNotification = createMockNotificationDTO('notif-3');

      const mockNewNotificationStream =
        new Subject<TaskAssignationNotificationDTO>();
      mockNewNotificationStream.next(newNotification);
      spyApi.getNewNotifications.and.returnValue(of(firstListOfNotifications));
      spyApi.getRealTimeNewNotificationsStream.and.returnValue(
        mockNewNotificationStream
      );

      let emissionCount = 0;
      const notifsLength: { [emission: number]: number } = {};
      controller
        .getNewNotificationsForCurrentUser()
        .pipe(take(2))
        .subscribe({
          next: (notifs) => {
            emissionCount += 1;
            notifsLength[emissionCount] = notifs.length;
          },
          complete: () => {
            expect(notifsLength[1]).toEqual(2);
            expect(notifsLength[2]).toEqual(3);
          },
        });
    });

    it('should emit a list even if the NewNotification stream has not emitted anything', () => {
      const mockNewNotificationStream =
        new Subject<TaskAssignationNotificationDTO>();
      spyApi.getNewNotifications.and.returnValue(of(firstListOfNotifications));
      spyApi.getRealTimeNewNotificationsStream.and.returnValue(
        mockNewNotificationStream
      );

      controller
        .getNewNotificationsForCurrentUser()
        .pipe(take(1))
        .subscribe({
          next: (notifs) => {
            expect(notifs.length).toEqual(2);
          },
        });

      const mockEmissionInCaseItDidNotEmitBeforeNewNotificationStreamEmits =
        createMockNotificationDTO('');
      mockNewNotificationStream.next(
        mockEmissionInCaseItDidNotEmitBeforeNewNotificationStreamEmits
      );
    });

    it('should correctly the new notifications coming from the NewNotification stream', () => {
      const newNotification: TaskAssignationNotificationDTO = {
        id: 'notif-3',
        project: null,
        task: null,
        type: NotificationType.ASSIGNATION,
        assigneeId: 'assignee-id-123',
      };

      const anotherNotification: TaskAssignationNotificationDTO = {
        id: 'notif-4',
        project: null,
        task: null,
        type: NotificationType.ASSIGNATION,
        assigneeId: 'assignee-id-123',
      };

      const mockNewNotificationStream =
        new Subject<TaskAssignationNotificationDTO>();
      mockNewNotificationStream.next(newNotification);
      spyApi.getNewNotifications.and.returnValue(of(firstListOfNotifications));
      spyApi.getRealTimeNewNotificationsStream.and.returnValue(
        mockNewNotificationStream
      );

      let emissionCount = 0;
      const notifsLength: { [emission: number]: number } = {};
      controller
        .getNewNotificationsForCurrentUser()
        .pipe(take(3))
        .subscribe({
          next: (notifs) => {
            emissionCount += 1;
            notifsLength[emissionCount] = notifs.length;
          },
          complete: () => {
            expect(notifsLength[1]).toEqual(2);
            expect(notifsLength[2]).toEqual(3);
            expect(notifsLength[3]).toEqual(4);
          },
        });

      mockNewNotificationStream.next(anotherNotification);
    });
  });
});

function createMockNotificationDTO(id: string): TaskAssignationNotificationDTO {
  return {
    id,
    assigneeId: '',
    project: null,
    task: null,
    type: NotificationType.ASSIGNATION,
  };
}
