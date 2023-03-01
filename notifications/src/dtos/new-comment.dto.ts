import { NewCommentNotification } from '../models';

export type NewCommentDTO = Omit<NewCommentNotification, 'id'>;
