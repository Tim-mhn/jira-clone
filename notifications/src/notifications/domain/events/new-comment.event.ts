import { CommentAuthor, ProjectIdName, TaskId } from '../models';

export type Task = {
  id: TaskId;
  name: string;
};
export type NewCommentEvent = {
  task: Task;
  project: ProjectIdName;
  comment: string;
  author: CommentAuthor;
};
