import { Tasks } from './task';

export type SprintPointsBreakdown = {
  New: number;
  InProgress: number;
  Done: number;
};
export type Sprint = {
  Id: string;
  Name: string;
  IsBacklog: boolean;
  Points: SprintPointsBreakdown;
};

export type Sprints = Sprint[];

export type SprintWithTasks = {
  Sprint: Sprint;
  Tasks: Tasks;
};
