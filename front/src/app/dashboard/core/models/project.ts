import { ProjectMember } from './project-member';
import { Task } from './task';
import { TaskStatus } from './task-status';

export interface ProjectIdName {
  Id: string;
  Name: string;
}

export type ProjectIdNames = ProjectIdName[];

export type Project = ProjectIdName & {
  Members: ProjectMember[];
  Tasks: Task[];
  AllTaskStatus: TaskStatus[];
};
