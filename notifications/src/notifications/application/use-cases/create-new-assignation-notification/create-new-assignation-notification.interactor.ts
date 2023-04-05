import { Inject, Injectable } from '@nestjs/common';
import {
  NotificationId,
  TaskAssignationNotification,
  TaskAssignedEvent,
} from '../../../domain';
import { TaskFollowersRepository } from '../../../domain/repositories';
import { TaskAssignationNotificationsRepository } from '../../../domain/repositories/assignation-notification.repository';
import { TaskAssignationNotificationsRepositoryToken } from '../../../adapter/providers';
import { TaskFollowersRepositoryToken } from '../../../adapter/providers/task-followers-repository.provider';
import { NewNotificationEmitter } from '../../emitters/new-notification.emitter';

@Injectable()
export class CreateNewAssignationNotificationInteractor {
  constructor(
    @Inject(TaskAssignationNotificationsRepositoryToken)
    private repo: TaskAssignationNotificationsRepository,
    @Inject(TaskFollowersRepositoryToken)
    private followersRepo: TaskFollowersRepository,
    private newNotificationEmitter: NewNotificationEmitter,
  ) {}

  async handle(taskAssigned: TaskAssignedEvent) {
    const { assignedById, assigneeId, task } = taskAssigned;

    await this._dismissOtherAssignationNotificationsFromTask(task.id);

    const userHasSelfAssignedTask = assigneeId === assignedById;
    if (userHasSelfAssignedTask) return;

    await this._addAssigneeAsTaskFollower(taskAssigned);
    const newNotificationId = await this.repo.create(taskAssigned);
    const newNotification = this._buildTaskAssignationNotification(
      taskAssigned,
      newNotificationId,
    );
    this.newNotificationEmitter.fireNewNotificationEvent(newNotification);
  }

  private _buildTaskAssignationNotification(
    taskAssigned: TaskAssignedEvent,
    notificationId: NotificationId,
  ) {
    const { assigneeId, project, task } = taskAssigned;

    const newNotification = new TaskAssignationNotification({
      id: notificationId,
      assigneeId,
      project,
      task,
    });

    return newNotification;
  }

  private async _addAssigneeAsTaskFollower(taskAssigned: TaskAssignedEvent) {
    await this.followersRepo.markUserAsFollowerOfTask(
      taskAssigned.assigneeId,
      taskAssigned.task.id,
    );
  }

  private async _dismissOtherAssignationNotificationsFromTask(taskId: string) {
    this.repo.dismissNotificationsFromTask(taskId);
  }
}
