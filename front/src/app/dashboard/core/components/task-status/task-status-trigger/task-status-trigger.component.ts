import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jira-task-status-trigger',
  templateUrl: './task-status-trigger.component.html',
})
export class TaskStatusTriggerComponent implements OnInit {
  readonly ARROW_DOWN = 'assets/icons/arrow-down-blue.svg';
  constructor() {}

  onFocus = () => console.log('focus');
  ngOnInit(): void {}
}
