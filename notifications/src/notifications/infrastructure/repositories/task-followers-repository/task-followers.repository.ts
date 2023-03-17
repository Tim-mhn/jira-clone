import { Injectable, Scope } from '@nestjs/common';
import { TaskFollowerId, TaskId } from '../../../domain/models';
import { PersistenceStorage } from '../../persistence/persistence.storage';
import { TaskFollowersPersistence } from '../../persistence/task-followers.persistence';
import { JSONFileStorage } from '../../storage/json-file.storage';

const FOLLOWERS_FILENAME =
  './src/notifications/infrastructure/persistence/task-followers.json';

const FollowersJSONFileStorage: PersistenceStorage<TaskFollowersPersistence> =
  new JSONFileStorage(FOLLOWERS_FILENAME);

@Injectable({ scope: Scope.DEFAULT })
export class TaskFollowersRepository {
  private storage: PersistenceStorage<TaskFollowersPersistence> =
    FollowersJSONFileStorage;

  async getTaskFollowersIds(taskId: TaskId): Promise<TaskFollowerId[]> {
    const allTasksFollowers = await this.storage.get();
    return allTasksFollowers[taskId] || [];
  }

  async markUserAsFollowerOfTask(userId: TaskFollowerId, taskId: TaskId) {
    const taskFollowers = await this.getTaskFollowersIds(taskId);

    const updatedTaskFollowers = Array.from(
      new Set([...taskFollowers, userId]),
    );

    const allTasksFollowers = await this.storage.get();

    allTasksFollowers[taskId] = updatedTaskFollowers;
    this.storage.set(allTasksFollowers);
  }

  async getTasksFollowedByUser(userId: TaskFollowerId): Promise<TaskId[]> {
    const followedTaskIds: TaskId[] = [];

    const allTasksFollowers = await this.storage.get();
    Object.entries(allTasksFollowers).forEach(([taskId, followerIds]) => {
      if (followerIds.includes(userId)) followedTaskIds.push(taskId);
    });

    return followedTaskIds;
  }
}
