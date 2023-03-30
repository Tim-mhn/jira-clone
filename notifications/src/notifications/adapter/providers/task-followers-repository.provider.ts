import { Provider } from '@nestjs/common';
import { DBTaskFollowersRepository } from '../../infrastructure/repositories/task-followers/task-followers.repository';

export const TaskFollowersRepositoryToken = 'TaskFollowersRepositoryToken';

export const TaskFollowersRepositoryProvider: Provider = {
  provide: TaskFollowersRepositoryToken,
  useClass: DBTaskFollowersRepository,
};
