import { take } from 'rxjs';
import { User } from '../../../auth';
import { TaskAssignationNotification } from '../../domain';
import { NewNotificationEmitter } from './new-notification.emitter';

describe('NewNotificationEmitter', () => {
  let emitter: NewNotificationEmitter;

  beforeEach(() => {
    emitter = new NewNotificationEmitter();
  });

  describe('getNotificationStreamOfUser', () => {
    it('should only emit a notification if the assignee is not the user', () => {
      const user: User = {
        Email: '',
        Id: 'user-1',
        Name: 'User 1',
      };

      const notificationShouldNotBeEmitted = new TaskAssignationNotification({
        id: 'notif-1',
        assigneeId: 'assignee-id-123-jgz',
        project: null,
        task: null,
      });

      const notificationShouldBeEmitted = new TaskAssignationNotification({
        id: 'notif-2',
        assigneeId: user.Id,
        project: null,
        task: null,
      });
      const userNotification$ = emitter.getNotificationStreamOfUser(user);

      userNotification$.pipe(take(1)).subscribe((notif) => {
        expect(notif).toEqual(notificationShouldBeEmitted);
      });
      emitter.fireNewNotificationEvent(notificationShouldNotBeEmitted);
      emitter.fireNewNotificationEvent(notificationShouldBeEmitted);
    });
  });
});
