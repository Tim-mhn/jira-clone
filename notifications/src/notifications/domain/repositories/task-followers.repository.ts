import { TaskFollowerId, TaskId } from '../models';

export interface TaskFollowersRepository {
  getTaskFollowersIds(taskId: TaskId): Promise<TaskFollowerId[]>;
  markUserAsFollowerOfTask(
    userId: TaskFollowerId,
    taskId: TaskId,
  ): Promise<void>;
  getTasksFollowedByUser(userId: TaskFollowerId): Promise<TaskId[]>;
}
