import { CommentAuthor, ProjectIdName, Task } from '../models';

export type NewCommentEvent = {
  task: Task;
  project: ProjectIdName;
  comment: string;
  author: CommentAuthor;
};
