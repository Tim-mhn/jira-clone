import { ProjectMember } from '../models/project-member';

export type ProjectDTO = {
  Id: string;
  Name: string;
  Key: string;
  Icon: string;
  Members: ProjectMember[];
  Creator: ProjectMember;
};
