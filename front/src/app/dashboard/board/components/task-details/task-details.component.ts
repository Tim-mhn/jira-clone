import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../../../core/models/project';
import { Task } from '../../../core/models/task';

@Component({
  selector: 'jira-task-details',
  templateUrl: './task-details.component.html',
})
export class TaskDetailsComponent implements OnInit {
  @Input() task: Task;
  @Input() project: Project;

  constructor() {}

  ngOnInit(): void {}
}
