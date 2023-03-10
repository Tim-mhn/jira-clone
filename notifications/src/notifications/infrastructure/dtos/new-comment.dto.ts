import { IsNotEmpty } from 'class-validator';
import { NewCommentEvent } from '../../domain/events/new-comment.event';
import { CommentAuthor, ProjectIdName } from '../../domain/models';

export class NewCommentDTO implements NewCommentEvent {
  @IsNotEmpty()
  taskId: string;

  @IsNotEmpty()
  project: ProjectIdName;

  @IsNotEmpty()
  comment: string;

  @IsNotEmpty()
  author: CommentAuthor;
}
