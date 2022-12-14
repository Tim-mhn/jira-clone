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
}

export type Tasks = Task[];
