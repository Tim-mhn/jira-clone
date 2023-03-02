import { NewCommentNotification } from '../../domain/models';

export type NewCommentDTO = Omit<NewCommentNotification, 'id'>;
