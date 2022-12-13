import { Component, Input, OnInit } from '@angular/core';
import { Tasks } from '../../../core/models/task';

@Component({
  selector: 'jira-task-list',
  templateUrl: './task-list.component.html',
})
export class TaskListComponent implements OnInit {
  @Input() tasks: Tasks;

  constructor() {}

  ngOnInit(): void {}
}
