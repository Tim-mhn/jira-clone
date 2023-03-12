import { TaskFollowersRepository } from '../../infrastructure/repositories/task-followers-repository/task-followers.repository';

export function getMockTaskFollowersRepository(): TaskFollowersRepository {
  const mock: TaskFollowersRepository = {
    getTaskFollowersIds: jest.fn(),
    markUserAsFollowerOfTask: jest.fn(),
    getTasksFollowedByUser: jest.fn(),
  } as any as TaskFollowersRepository;

  return mock;
}
