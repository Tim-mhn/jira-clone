import { IsNotEmpty } from 'class-validator';
import {
  CommentAuthor,
  NewCommentNotification,
  ProjectIdName,
} from '../../domain/models';

export class NewCommentDTO implements Omit<NewCommentNotification, 'id'> {
  @IsNotEmpty()
  taskId: string;

  @IsNotEmpty()
  project: ProjectIdName;

  @IsNotEmpty()
  comment: string;

  @IsNotEmpty()
  author: CommentAuthor;
}
