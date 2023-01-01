import { Component, Input, OnInit } from '@angular/core';
import { ProjectMember } from '../../../dashboard/core/models/project-member';

@Component({
  selector: 'jira-member-icon',
  templateUrl: './member-icon.component.html',
})
export class MemberIconComponent implements OnInit {
  readonly EMPTY_MEMBER_ICON = 'assets/icons/user.png';
  @Input() member: ProjectMember;

  constructor() {}

  ngOnInit(): void {}
}
