import { Component, Input, OnInit } from '@angular/core';
import { Notification } from '../../../models';

@Component({
  selector: 'jira-notification-wrapper',
  templateUrl: './notification-wrapper.component.html',
})
export class NotificationWrapperComponent implements OnInit {
  @Input() notification: Notification<any>;
  constructor() {}

  ngOnInit(): void {}
}
