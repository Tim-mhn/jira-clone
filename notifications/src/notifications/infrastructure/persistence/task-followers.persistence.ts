import { TaskFollowerId, TaskId } from '../../domain/models';

export type TaskFollowersPersistence = {
  [t: TaskId]: TaskFollowerId[];
};
