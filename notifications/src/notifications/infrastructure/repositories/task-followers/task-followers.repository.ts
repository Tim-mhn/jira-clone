import { Injectable } from '@nestjs/common';
import { logMethod } from '../../../../shared/logger';
import { TaskFollowerId, TaskId } from '../../../domain';
import { TaskFollowersRepository } from '../../../domain/repositories';
import { prismaClient } from '../../database';

@Injectable()
export class DBTaskFollowersRepository implements TaskFollowersRepository {
  prisma = prismaClient;

  async getTaskFollowersIds(taskId: string): Promise<TaskFollowerId[]> {
    return (
      await this.prisma.taskFollowers.findMany({
        where: {
          taskId,
        },
        select: {
          followerId: true,
        },
      })
    ).map(({ followerId }) => followerId);
  }

  async markUserAsFollowerOfTask(
    userId: string,
    taskId: string,
  ): Promise<void> {
    await this.prisma.taskFollowers.upsert({
      where: {
        taskId_followerId: {
          followerId: userId,
          taskId,
        },
      },
      create: {
        followerId: userId,
        taskId,
      },
      update: {},
    });
  }

  async getTasksFollowedByUser(userId: string): Promise<TaskId[]> {
    return (
      await this.prisma.taskFollowers.findMany({
        where: {
          followerId: userId,
        },
        select: {
          taskId: true,
        },
      })
    ).map(({ taskId }) => taskId);
  }
}
