import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../../auth/models/user';

@Component({
  selector: 'jira-member-info',
  templateUrl: './member-info.component.html',
})
export class MemberInfoComponent implements OnInit {
  @Input() member: User;
  constructor() {}

  ngOnInit(): void {}
}
