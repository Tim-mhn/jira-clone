import {
  CommentNotification,
  NewNotifications,
  NotificationType,
} from '../models';
import { SomeUnreadNotificationsPipe } from './some-unread-notifications.pipe';

describe('SomeUnreadNotificationsPipe', () => {
  let pipe: SomeUnreadNotificationsPipe;

  beforeEach(() => {
    pipe = new SomeUnreadNotificationsPipe();
  });
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return true if at least one notification is unread', () => {
    const notif = new CommentNotification({
      author: null,
      comment: '',
      id: 'caeceac',
      project: null,
      task: null,
      type: NotificationType.COMMENT,
    });

    expect(pipe.transform([notif])).toBeTrue();
  });

  it('should return false if all notifications have been read', () => {
    const notif1 = new CommentNotification({
      author: null,
      comment: '',
      id: 'caeceac',
      project: null,
      task: null,
      type: NotificationType.COMMENT,
    });

    const notif2 = new CommentNotification({
      author: null,
      comment: '',
      id: 'caeceac',
      project: null,
      task: null,
      type: NotificationType.COMMENT,
    });

    notif1.markAsRead();
    notif2.markAsRead();

    expect(pipe.transform([notif1, notif2])).toBeFalse();
  });

  it('should return false if array is empty', () => {
    const noNotifications = [] as NewNotifications;
    expect(pipe.transform(noNotifications)).toBeFalse();
  });
});
