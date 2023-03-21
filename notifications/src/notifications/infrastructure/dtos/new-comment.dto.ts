import { IsNotEmpty } from 'class-validator';
import { NewCommentEvent } from '../../domain/events/new-comment.event';
import { CommentAuthor, ProjectIdName } from '../../domain/models';
import { NotificationTaskDTO } from './notification-task.dto';

export class NewCommentDTO implements NewCommentEvent {
  @IsNotEmpty()
  task: NotificationTaskDTO;

  @IsNotEmpty()
  project: ProjectIdName;

  @IsNotEmpty()
  comment: string;

  @IsNotEmpty()
  author: CommentAuthor;
}
