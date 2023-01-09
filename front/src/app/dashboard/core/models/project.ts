import { ProjectMember } from './project-member';
import { SprintWithTasks } from './sprint';
import { TaskStatus } from './task-status';

export interface ProjectIdName {
  Id: string;
  Name: string;
}

export type ProjectIdNames = ProjectIdName[];

export type Project = ProjectIdName & {
  Members: ProjectMember[];
  Sprints: SprintWithTasks[];
  AllTaskStatus: TaskStatus[];
};
