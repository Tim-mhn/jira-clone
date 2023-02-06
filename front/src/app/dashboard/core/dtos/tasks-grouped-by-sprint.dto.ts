import { SprintDTO } from './sprints.dtos';
import { TaskDTO } from './task.dto';

export type TasksGroupedBySprintsItemDTO = {
  Tasks: TaskDTO[];
  Sprint: SprintDTO;
};

export type TasksGroupedBySprintsDTO = TasksGroupedBySprintsItemDTO[];
