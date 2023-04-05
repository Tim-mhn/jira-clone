import { Subject } from 'rxjs';
import { User } from '../../../auth/models/user';
import { SprintIdName, SprintInfo } from './sprint';
import { TaskStatus } from './task-status';
import { TaskType } from './task-type';
import { TaskTag } from '../../features/tags/task-tag';

export interface ITask {
  Id: string;
  Title: string;
  RawTitle: string;
  Description: string;
  Status: TaskStatus;
  Points: number;
  Assignee: User;
  Key: string;
  Sprint: SprintIdName;
  Type: TaskType;
  Tags: TaskTag[];
}

export class Task implements ITask {
  Id: string;
  Title: string;
  RawTitle: string;
  Description: string;
  Status: TaskStatus;
  Points: number;
  Assignee: User;
  Key: string;
  Sprint: SprintIdName;
  Type: TaskType;
  Tags: TaskTag[];

  private _update$ = new Subject<void>();
  public update$ = this._update$.asObservable();

  constructor(props: ITask) {
    const {
      Assignee,
      Description,
      Title,
      Id,
      Points,
      Status,
      Key,
      Sprint,
      Type,
      RawTitle,
      Tags,
    } = props;
    this.Id = Id;
    this.Assignee = Assignee;
    this.Description = Description;
    this.Title = Title;
    this.Points = Points;
    this.Status = Status;
    this.Key = Key;
    this.Sprint = Sprint;
    this.Type = Type;
    this.RawTitle = RawTitle;
    this.Tags = Tags;
  }

  private _emitUpdate() {
    this._update$.next();
  }

  public updateStatus(newStatus: TaskStatus) {
    this.Status = newStatus;
    this._emitUpdate();
  }

  public updateAssignee(newAssignee: User) {
    this.Assignee = newAssignee;
    this._emitUpdate();
  }

  public updateDescription(newDescription: string) {
    this.Description = newDescription;
    this._emitUpdate();
  }

  public updateTitle(titles: { RawTitle: string; Title: string }) {
    const { RawTitle, Title } = titles;
    this.RawTitle = RawTitle;
    this.Title = Title;
    this._emitUpdate();
  }

  public updateTags(tags: TaskTag[]) {
    this.Tags = tags;
    this._emitUpdate();
  }

  public updatePoints(newPoints: number) {
    this.Points = newPoints;
    this._emitUpdate();
  }

  public moveTaskToSprint(sprint: SprintInfo) {
    this.Sprint = sprint;
    this._emitUpdate();
  }

  public updateType(type: TaskType) {
    this.Type = type;
    this._emitUpdate();
  }
}

export type Tasks = Task[];
