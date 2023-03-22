import { Inject, Injectable } from '@nestjs/common';
import { TaskAssignedEvent } from '../../../domain';
import { TaskFollowersRepository } from '../../../domain/repositories';
import { TaskAssignationNotificationsRepository } from '../../../domain/repositories/assignation-notification.repository';
import { TaskAssignationNotificationsRepositoryToken } from '../../../infrastructure/providers';
import { TaskFollowersRepositoryToken } from '../../../infrastructure/providers/task-followers-repository.provider';

@Injectable()
export class CreateNewAssignationNotificationInteractor {
  constructor(
    @Inject(TaskAssignationNotificationsRepositoryToken)
    private repo: TaskAssignationNotificationsRepository,
    @Inject(TaskFollowersRepositoryToken)
    private followersRepo: TaskFollowersRepository,
  ) {}

  async handle(taskAssigned: TaskAssignedEvent) {
    await this._dismissOtherAssignationNotificationsFromTask(
      taskAssigned.task.id,
    );
    const userHasSelfAssignedTask =
      taskAssigned.assigneeId === taskAssigned.assignerId;
    if (userHasSelfAssignedTask) return;

    await this._addAssigneeAsTaskFollower(taskAssigned);
    return this.repo.create(taskAssigned);
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
