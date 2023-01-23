import { ProjectMember } from './project-member';
import { TaskStatus } from './task-status';

export type ProjectId = string;
export interface ProjectInfo {
  Id: ProjectId;
  Name: string;
  Key: string;
  Icon: string;
  Creator: ProjectMember;
}

export type ProjectInfoList = ProjectInfo[];

export type Project = ProjectInfo & {
  Members: ProjectMember[];
  AllTaskStatus: TaskStatus[];
};
