import { TaskAssignationNotificationPersistence } from '../../persistence/task-assignation-notification.persistence';
import { AppLocalStorage } from '../../storage/local-storage';
import { JSONTaskAssignationNotificationRepository } from './assignation-notification.repository';

describe('TaskAssignationNotificationRepository', () => {
  let repo: JSONTaskAssignationNotificationRepository;

  const localStorage = new AppLocalStorage<
    TaskAssignationNotificationPersistence[]
  >();

  beforeEach(() => {
    repo = new JSONTaskAssignationNotificationRepository();
    repo['storage'] = localStorage;
  });

  describe('dismissNotificationsFromTask', () => {
    it('should correctly mark all the notifications from that task as dismissed', async () => {
      const taskId = 'xyz-task-123';

      const assigneeId = 'assignee-id';

      const initialNotifs: TaskAssignationNotificationPersistence[] = [
        {
          assigneeId,
          id: '1',
          dismissed: false,
          project: null,
          read: false,
          taskId,
        },
        {
          assigneeId,
          id: '2',
          dismissed: false,
          project: null,
          read: false,
          taskId,
        },
        {
          assigneeId,
          id: '3',
          dismissed: false,
          project: null,
          read: false,
          taskId,
        },
      ];

      await localStorage.set(initialNotifs);

      await repo.dismissNotificationsFromTask(taskId);

      const allNotifs = await localStorage.get();

      const dismissedNotifs = allNotifs.filter((n) => n.dismissed);

      expect(dismissedNotifs.length).toEqual(initialNotifs.length);
    });
  });
});
