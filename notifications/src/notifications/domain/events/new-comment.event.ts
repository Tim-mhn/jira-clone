import { CommentAuthor, ProjectIdName, TaskId } from '../models';

export type NewCommentEvent = {
  taskId: TaskId;
  project: ProjectIdName;
  comment: string;
  author: CommentAuthor;
};
