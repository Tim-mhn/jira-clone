import { ProjectIdName } from '../../../core/models';
import { TaskInfo } from '../models/task-info';

export type SearchTaskDTO = TaskInfo;

export type SearchSprintDTO = {
  Id: string;
  Name: string;
  Project: ProjectIdName;
};
export type SearchResultsDTO = {
  Tasks: SearchTaskDTO[];
  Sprints: SearchSprintDTO[];
};
