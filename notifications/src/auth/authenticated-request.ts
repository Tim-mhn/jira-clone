import { User } from './user';

export interface AuthenticatedRequest extends Request {
  user: User;
}
