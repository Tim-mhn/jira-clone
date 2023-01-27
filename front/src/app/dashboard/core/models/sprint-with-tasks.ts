import { Sprint } from './sprint';
import { Tasks } from './task';

export type SprintWithTasks = {
  Sprint: Sprint;
  Tasks: Tasks;
};
