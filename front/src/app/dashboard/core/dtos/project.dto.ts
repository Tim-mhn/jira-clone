import { ProjectMember } from '../models/project-member';

export type ProjectDTO = {
  Id: string;
  Name: string;
  Members: ProjectMember[];
};
