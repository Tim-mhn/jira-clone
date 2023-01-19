import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjectMember, SprintInfo, Task } from '../../../../core/models';
import { Project } from '../../../../core/models/project';

@Component({
  selector: 'jira-task-details',
  templateUrl: './task-details.component.html',
})
export class TaskDetailsComponent implements OnInit {
  @Input() task: Task;
  @Input() project: Project;
  @Input() members: ProjectMember[];
  @Input() sprints: SprintInfo[];

  @Output() crossClicked = new EventEmitter<void>();
  constructor() {}

  ngOnInit(): void {}
}
