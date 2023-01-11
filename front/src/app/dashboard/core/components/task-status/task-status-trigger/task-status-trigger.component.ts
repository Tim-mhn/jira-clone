import { Component, Input, OnInit } from '@angular/core';
import { TaskStatus } from '../../../models/task-status';

@Component({
  selector: 'jira-task-status-trigger',
  templateUrl: './task-status-trigger.component.html',
})
export class TaskStatusTriggerComponent implements OnInit {
  readonly ARROW_DOWN = 'assets/icons/arrow-down-blue.svg';
  @Input() status: TaskStatus;
  constructor() {}

  ngOnInit(): void {}
}
