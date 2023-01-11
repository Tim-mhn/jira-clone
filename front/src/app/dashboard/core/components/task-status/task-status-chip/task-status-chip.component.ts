import { Component, Input, OnInit } from '@angular/core';
import { TaskStatus } from '../../../models/task-status';

@Component({
  selector: 'jira-task-status-chip',
  templateUrl: './task-status-chip.component.html',
  host: {
    class: 'inline-block',
  },
})
export class TaskStatusChipComponent implements OnInit {
  @Input() status: TaskStatus;
  constructor() {}

  ngOnInit(): void {}
}
