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
};
export type SprintProps = SprintInfo & {
  Points: SprintPointsBreakdown;
};

export class Sprint implements SprintProps {
  Id: string;
  Name: string;
  IsBacklog: boolean;
  Points: SprintPointsBreakdown;

  constructor(props: SprintProps) {
    const { Id, IsBacklog, Name, Points } = props;
    this.Id = Id;
    this.IsBacklog = IsBacklog;
    this.Name = Name;
    this.Points = Points;
  }

  public updateName(newName: string) {
    this.Name = newName;
    this._emitUpdate();
  }

  private _update$ = new Subject<void>();
  public update$ = this._update$.asObservable();

  private _emitUpdate() {
    this._update$.next();
  }
}

export type Sprints = Sprint[];
