import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Project } from '../../../core/models/project';
import { ProjectMember } from '../../../core/models/project-member';
import { Task } from '../../../core/models/task';

@Component({
  selector: 'jira-task-details',
  templateUrl: './task-details.component.html',
})
export class TaskDetailsComponent implements OnInit {
  @Input() task: Task;
  @Input() project: Project;
  @Input() members: ProjectMember[];

  @Output() crossClicked = new EventEmitter<void>();
  constructor() {}

  ngOnInit(): void {}
}
