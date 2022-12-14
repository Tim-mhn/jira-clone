import { Constraint } from '../../../shared/types/constraint.type';
import { ProjectInfo } from '../models/project';
import { ITask } from '../models/task';

export type ProjectInfoDTO = Constraint<
  ProjectInfo,
  {
    Tasks: ITask[];
  }
>;
