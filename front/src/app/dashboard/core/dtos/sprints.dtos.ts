import { Constraint } from '../../../shared/types/constraint.type';
import { SprintInfo, SprintProps } from '../models';

export type SprintInfoDTO = Constraint<
  SprintInfo,
  {
    StartDate: string;
    EndDate: string;
  }
>;

export type SprintDTO = Constraint<
  SprintProps,
  {
    StartDate: string;
    EndDate: string;
  }
>;

export type UpdateSprintDTO = {
  name?: string;
  startDate?: string;
  endDate?: string;
};
