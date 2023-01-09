import { Sprint } from '../models/sprint';
import { TaskDTO } from './task.dto';

export type TasksGroupedBySprintsItemDTO = {
  Tasks: TaskDTO[];
  Sprint: Sprint;
};

export type TasksGroupedBySprintsDTO = TasksGroupedBySprintsItemDTO[];
