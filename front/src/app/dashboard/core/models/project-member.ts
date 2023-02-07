import { TimDate } from '@tim-mhn/common/date';
import { User } from '../../../auth/models/user';

export type ProjectMember = User & {
  JoinedOn: TimDate;
};
export type ProjectMembers = ProjectMember[];
