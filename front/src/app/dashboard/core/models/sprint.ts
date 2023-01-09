import { Tasks } from './task';

export type Sprint = {
  Id: string;
  Name: string;
  IsBacklog: boolean;
};

export type Sprints = Sprint[];

export type SprintWithTasks = {
  Sprint: Sprint;
  Tasks: Tasks;
};
