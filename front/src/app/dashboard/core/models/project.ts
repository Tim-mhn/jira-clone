import { ProjectMember } from './project-member';
import { TaskStatus } from './task-status';
import { TaskType } from './task-type';

export type ProjectId = string;

export type ProjectIdName = {
  Id: ProjectId;
  Name: string;
};
export type ProjectInfo = ProjectIdName & {
  Key: string;
  Icon: string;
  Creator: ProjectMember;
};

export type ProjectInfoList = ProjectInfo[];

export type Project = ProjectInfo & {
  AllTaskStatus: TaskStatus[];
  TaskTypes: TaskType[];
};
