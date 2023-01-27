export type SprintPointsBreakdown = {
  New: number;
  InProgress: number;
  Done: number;
};

export type SprintInfo = {
  Id: string;
  Name: string;
  IsBacklog: boolean;
};
export type Sprint = SprintInfo & {
  Points: SprintPointsBreakdown;
};

export type Sprints = Sprint[];
