import { Component, Input, OnInit } from '@angular/core';
import { ProjectMember } from '../../../core/models/project-member';
import { Task } from '../../../core/models/task';
import { TaskStatus } from '../../../core/models/task-status';

@Component({
  selector: 'jira-task-details',
  templateUrl: './task-details.component.html',
})
export class TaskDetailsComponent implements OnInit {
  @Input() task: Task;
  @Input() projectId: string;
  @Input() projectMembers: ProjectMember[];
  @Input() allStatus: TaskStatus[];
  constructor() {}

  ngOnInit(): void {}
}
