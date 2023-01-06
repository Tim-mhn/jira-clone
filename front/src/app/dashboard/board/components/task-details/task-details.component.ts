import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Project } from '../../../core/models/project';
import { Task } from '../../../core/models/task';

@Component({
  selector: 'jira-task-details',
  templateUrl: './task-details.component.html',
})
export class TaskDetailsComponent implements OnInit {
  @Input() task: Task;
  @Input() project: Project;

  @Output() crossClicked = new EventEmitter<void>();
  constructor() {}

  ngOnInit(): void {}
}
