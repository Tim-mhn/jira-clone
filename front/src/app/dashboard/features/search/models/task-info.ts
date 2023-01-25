import { ProjectIdName } from '../../../core/models';

export type TaskInfo = {
  Points: number;
  Id: string;
  Title: string;
  Description: string;
  Key: string;
  Project: ProjectIdName;
};
