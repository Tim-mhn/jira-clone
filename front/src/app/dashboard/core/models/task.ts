import { ProjectMember } from './project-member';
import { TaskStatus } from './task-status';

export interface ITask {
  Id: string;
  Title: string;
  Description: string;
  Status: TaskStatus;
  Points: number;
  Assignee: ProjectMember;
}

export class Task implements ITask {
  Id: string;
  Title: string;
  Description: string;
  Status: TaskStatus;
  Points: number;
  Assignee: ProjectMember;

  constructor(props: ITask) {
    const { Assignee, Description, Title, Id, Points, Status } = props;
    this.Id = Id;
    this.Assignee = Assignee;
    this.Description = Description;
    this.Title = Title;
    this.Points = Points;
    this.Status = Status;
  }

  public updateStatus(newStatus: TaskStatus) {
    this.Status = newStatus;
  }

  public updateAssignee(newAssignee: ProjectMember) {
    this.Assignee = newAssignee;
  }

  public updateDescription(newDescription: string) {
    this.Description = newDescription;
  }

  public updateTitle(newTitle: string) {
    this.Title = newTitle;
  }

  public updatePoints(newPoints: number) {
    this.Points = newPoints;
  }
}

export type Tasks = Task[];
