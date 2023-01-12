import { Component, Input, OnInit } from '@angular/core';
import { ProjectMember } from '../../../../dashboard/core/models/project-member';

@Component({
  selector: 'jira-member-info',
  templateUrl: './member-info.component.html',
})
export class MemberInfoComponent implements OnInit {
  @Input() member: ProjectMember;
  constructor() {}

  ngOnInit(): void {}
}
