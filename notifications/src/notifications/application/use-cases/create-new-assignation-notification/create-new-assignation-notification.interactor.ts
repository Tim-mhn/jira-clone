import { Inject, Injectable } from '@nestjs/common';
import { TaskAssignedEvent } from '../../../domain';
import { TaskAssignationNotificationsRepository } from '../../../domain/repositories/assignation-notification.repository';
import { TaskAssignationNotificationsRepositoryToken } from '../../../infrastructure/providers';

@Injectable()
export class CreateNewAssignationNotificationInteractor {
  constructor(
    @Inject(TaskAssignationNotificationsRepositoryToken)
    private repo: TaskAssignationNotificationsRepository,
  ) {}

  async handle(taskAssigned: TaskAssignedEvent) {
    await this._dismissOtherAssignationNotificationsFromTask(
      taskAssigned.task.id,
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
