import { TimDate } from '@tim-mhn/common/date';
import { DateRange } from '@tim-mhn/ng-forms/date-range-picker';
import { Observable, ReplaySubject, Subject } from 'rxjs';

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
  Completed: boolean;
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
  ProjectId: string;
  Completed: boolean;

  private _completed$ = new ReplaySubject<boolean>();
  completed$: Observable<boolean> = this._completed$.asObservable();

  constructor(props: SprintProps) {
    const { Id, IsBacklog, Name, Points, EndDate, StartDate, Completed } =
      props;
    this.Id = Id;
    this.IsBacklog = IsBacklog;
    this.Name = Name;
    this.Points = Points;
    this.StartDate = StartDate;
    this.EndDate = EndDate;
    this.Completed = Completed;
    this._completed$.next(Completed);
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

  public reactive() {
    this._updateCompleted(false);
  }

  public markAsComplete() {
    this._updateCompleted(true);
  }

  private _updateCompleted(completed: boolean) {
    this.Completed = completed;
    this._completed$.next(completed);
    this._emitUpdate();
  }

  private _update$ = new Subject<void>();
  public update$ = this._update$.asObservable();

  private _emitUpdate() {
    this._update$.next();
  }
}

export type Sprints = Sprint[];
