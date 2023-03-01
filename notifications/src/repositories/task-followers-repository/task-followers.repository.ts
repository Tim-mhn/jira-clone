import { Injectable, Scope } from '@nestjs/common';
import { TaskFollowerId, TaskId } from '../../models';

@Injectable({ scope: Scope.DEFAULT })
export class TaskFollowersRepository {
  private TASK_FOLLOWERS = new Map<TaskId, Set<TaskFollowerId>>();

  getTaskFollowersIds(taskId: TaskId): TaskFollowerId[] {
    return Array.from(this.TASK_FOLLOWERS.get(taskId) || []);
  }

  markUserAsFollowerOfTask(userId: TaskFollowerId, taskId: TaskId) {
    const taskFollowers = this.getTaskFollowersIds(taskId);

    const updatedTaskFollowers = new Set([...taskFollowers, userId]);
    this.TASK_FOLLOWERS.set(taskId, updatedTaskFollowers);
    console.log(this.TASK_FOLLOWERS);
  }

  getTasksFollowedByUser(userId: TaskFollowerId): TaskId[] {
    const followedTaskIds: TaskId[] = [];
    this.TASK_FOLLOWERS.forEach((followerIds, taskId) => {
      if (followerIds.has(userId)) followedTaskIds.push(taskId);
    });

    return followedTaskIds;
  }
}
