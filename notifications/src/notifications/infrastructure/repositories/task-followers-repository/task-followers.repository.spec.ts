import { Test, TestingModule } from '@nestjs/testing';
import { PersistenceStorage } from '../../persistence/persistence.storage';
import { TaskFollowersPersistence } from '../../persistence/task-followers.persistence';
import { TaskFollowersRepository } from './task-followers.repository';

describe('TaskFollowersRepositoryService', () => {
  let repo: TaskFollowersRepository;

  const mockStorage: PersistenceStorage<TaskFollowersPersistence> = {
    get: async () => await {},
    set: async (_data: TaskFollowersPersistence) =>
      new Promise<void>((res) => res()),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskFollowersRepository],
    }).compile();

    repo = module.get<TaskFollowersRepository>(TaskFollowersRepository);
    repo['storage'] = mockStorage;
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  // describe('getTasksFollowedByUser', () => {
  //   it('should correctly return the list of task ids followed by given user id', () => {
  //     const task1 = '1';
  //     const task2 = '2';
  //     const userId = 'user-id';
  //     repo.markUserAsFollowerOfTask(userId, task1);
  //     repo.markUserAsFollowerOfTask(userId, task2);

  //     const tasksFollowed = repo.getTasksFollowedByUser(userId);

  //     expect(tasksFollowed).toEqual([task1, task2]);
  //   });
  // });
});

it('', () => {
  const v = true;
  expect(v).toBeTruthy();
});
