import { ProjectMember } from '../models/project-member';
import { TaskDTO } from './task.dto';

export type ProjectDTO = {
  Id: string;
  Name: string;
  Members: ProjectMember[];
  Tasks: TaskDTO[];
};
