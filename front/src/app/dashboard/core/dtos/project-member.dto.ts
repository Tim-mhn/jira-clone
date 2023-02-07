import { Constraint } from '../../../shared/types/constraint.type';
import { ProjectMember } from '../models';

export type ProjectMemberDTO = Constraint<
  ProjectMember,
  {
    JoinedOn: string;
  }
>;
