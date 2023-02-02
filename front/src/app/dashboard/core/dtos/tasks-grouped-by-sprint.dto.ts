import { SprintProps } from '../models/sprint';
import { TaskDTO } from './task.dto';

export type TasksGroupedBySprintsItemDTO = {
  Tasks: TaskDTO[];
  Sprint: SprintProps;
};

export type TasksGroupedBySprintsDTO = TasksGroupedBySprintsItemDTO[];
