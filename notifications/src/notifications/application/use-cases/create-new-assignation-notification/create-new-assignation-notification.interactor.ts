import { Inject, Injectable } from '@nestjs/common';
import { TaskAssignedEvent } from '../../../domain';
import { TaskAssignationNotificationRepository } from '../../../domain/repositories/assignation-notification.repository';
import { TaskAssignationNotificationRepositoryToken } from '../../../infrastructure/providers';

@Injectable()
export class CreateNewAssignationNotificationInteractor {
  constructor(
    @Inject(TaskAssignationNotificationRepositoryToken)
    private repo: TaskAssignationNotificationRepository,
  ) {}

  async handle(taskAssigned: TaskAssignedEvent) {
    await this._dismissOtherAssignationNotificationsFromTask(
      taskAssigned.taskId,
    );
    const userHasSelfAssignedTask =
      taskAssigned.assigneeId === taskAssigned.assignerId;
    if (userHasSelfAssignedTask) return;
    return this.repo.create(taskAssigned);
  }

  private async _dismissOtherAssignationNotificationsFromTask(taskId: string) {
    this.repo.dismissNotificationsFromTask(taskId);
  }
}
