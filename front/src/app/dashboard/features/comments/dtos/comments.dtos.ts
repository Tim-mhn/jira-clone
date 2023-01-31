import { ProjectTaskIds } from '../../../core/dtos';
import { ProjectMember } from '../../../core/models';

export type PostCommentDTO = {
  projectId: string;
  taskId: string;
  text: string;
};

export type GetCommentsDTO = ProjectTaskIds;

export type CommentDTO = {
  Id: string;
  Text: string;
  Author: ProjectMember;
  CreatedOn: string;
};

export type CommentListDTO = CommentDTO[];
