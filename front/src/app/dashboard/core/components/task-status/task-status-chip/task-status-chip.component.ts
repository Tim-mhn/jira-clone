import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jira-task-status-chip',
  templateUrl: './task-status-chip.component.html',
  host: {
    class: 'inline-block',
  },
})
export class TaskStatusChipComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
