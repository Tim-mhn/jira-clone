import { Component, Input, OnInit } from '@angular/core';
import { CommentNotification } from '../../../models';

@Component({
  selector: 'jira-comment-notification-ui',
  templateUrl: './comment-notification-ui.component.html',
})
export class CommentNotificationUiComponent implements OnInit {
  @Input() notification: CommentNotification;

  constructor() {}

  ngOnInit(): void {}
}
