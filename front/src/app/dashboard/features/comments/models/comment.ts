import { ProjectMember } from '../../../core/models/project-member';

export type TaskComment = {
  Id: string;
  Author: ProjectMember;
  Text: string;
  CreatedOn: Date;
};

export type TaskComments = TaskComment[];
