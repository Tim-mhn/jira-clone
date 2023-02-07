import { TimDate } from '@tim-mhn/common/date';
import { DateRange } from '@tim-mhn/ng-forms/date-range-picker';
import { Subject } from 'rxjs';

export type SprintPointsBreakdown = {
  New: number;
  InProgress: number;
  Done: number;
};

export type SprintInfo = {
  Id: string;
  Name: string;
  IsBacklog: boolean;
  StartDate: TimDate;
  EndDate: TimDate;
};
export type SprintProps = SprintInfo & {
  Points: SprintPointsBreakdown;
};

export class Sprint implements SprintProps {
  Id: string;
  Name: string;
  IsBacklog: boolean;
  Points: SprintPointsBreakdown;
  StartDate: TimDate;
  EndDate: TimDate;

  constructor(props: SprintProps) {
    const { Id, IsBacklog, Name, Points, EndDate, StartDate } = props;
    this.Id = Id;
    this.IsBacklog = IsBacklog;
    this.Name = Name;
    this.Points = Points;
    this.StartDate = StartDate;
    this.EndDate = EndDate;
  }

  public updateName(newName: string) {
    this.Name = newName;
    this._emitUpdate();
  }

  public updateStartEndDates(startEndDates: DateRange) {
    const { start, end } = startEndDates;
    this.StartDate = start;
    this.EndDate = end;
    this._emitUpdate();
  }

  private _update$ = new Subject<void>();
  public update$ = this._update$.asObservable();

  private _emitUpdate() {
    this._update$.next();
  }
}

export type Sprints = Sprint[];
