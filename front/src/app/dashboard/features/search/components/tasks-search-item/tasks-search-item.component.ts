import { Component, Input, OnInit } from '@angular/core';
import { TaskInfo } from '../../models/task-info';

@Component({
  selector: 'jira-tasks-search-item',
  templateUrl: './tasks-search-item.component.html',
  host: {
    class: 'overflow-hidden',
  },
})
export class TasksSearchItemComponent implements OnInit {
  @Input() taskInfo: TaskInfo;
  constructor() {}

  ngOnInit(): void {}
}
