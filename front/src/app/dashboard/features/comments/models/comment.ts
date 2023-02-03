import { ProjectMember } from '../../../core/models/project-member';

export type TaskComment = {
  Id: string;
  Author: ProjectMember;
  Text: string;
  CreatedOn: Date;
  TaskId: string;
};

export type TaskComments = TaskComment[];

export type UpdateComment = {
  Comment: TaskComment;
  NewText: string;
};
