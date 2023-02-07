import { ProjectMember } from '../../../../../core/models';

export type ProjectMemberTableItem = Pick<
  ProjectMember,
  'Email' | 'JoinedOn' | 'Name'
> & {
  icon: ProjectMember;
};
