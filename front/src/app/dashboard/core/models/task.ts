import { ProjectMember } from './project-member';

export interface Task {
  Id: string;
  Title: string;
  Description: string;
  Status: number;
  Points: number;
  Assignee: ProjectMember;
}

export type Tasks = Task[];
