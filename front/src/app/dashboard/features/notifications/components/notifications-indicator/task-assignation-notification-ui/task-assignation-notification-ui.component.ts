import { Component, Input, OnInit } from '@angular/core';
import { TaskAssignationNotification } from '../../../models';

@Component({
  selector: 'jira-task-assignation-notification-ui',
  templateUrl: './task-assignation-notification-ui.component.html',
})
export class TaskAssignationNotificationUiComponent implements OnInit {
  @Input() notification: TaskAssignationNotification;
  constructor() {}

  ngOnInit(): void {}
}
