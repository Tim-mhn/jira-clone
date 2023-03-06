import { Request } from 'express';

export type AuthenticatedRequestUser = {
  id: string;
  name: string;
};
export interface AuthenticatedRequest extends Request {
  user: AuthenticatedRequestUser;
}
