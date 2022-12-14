import { ProjectMember } from './project-member';
import { Task } from './task';

export interface Project {
  Id: string;
  Name: string;
}

export type Projects = Project[];

export type ProjectInfo = Project & {
  Members: ProjectMember[];
  Tasks: Task[];
};
