import { ProjectMember } from './project-member';
import { TaskStatus } from './task-status';

export interface ProjectInfo {
  Id: string;
  Name: string;
  Key: string;
  Icon: string;
}

export type ProjectInfoList = ProjectInfo[];

export type Project = ProjectInfo & {
  Members: ProjectMember[];
  AllTaskStatus: TaskStatus[];
};
