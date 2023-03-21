import { IsNotEmpty } from 'class-validator';
import { NewCommentEvent, Task } from '../../domain/events/new-comment.event';
import { CommentAuthor, ProjectIdName } from '../../domain/models';

class CommentTaskDTO implements Task {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;
}
export class NewCommentDTO implements NewCommentEvent {
  @IsNotEmpty()
  task: CommentTaskDTO;

  @IsNotEmpty()
  project: ProjectIdName;

  @IsNotEmpty()
  comment: string;

  @IsNotEmpty()
  author: CommentAuthor;
}
