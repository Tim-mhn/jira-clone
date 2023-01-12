import { Component, Input, OnInit } from '@angular/core';
import { ProjectMember } from '../../../../dashboard/core/models/project-member';

@Component({
  selector: 'jira-member-icon',
  templateUrl: './member-icon.component.html',
})
export class MemberIconComponent implements OnInit {
  readonly EMPTY_MEMBER_ICON = 'assets/icons/user.png';
  @Input() member: ProjectMember;
  @Input() set size(s: 'sm' | 'md') {
    this.imgSize = s === 'md' ? 24 : 20;
    this.classes = s === 'md' ? 'h-6 w-6' : 'h-5 w-5';
  }

  classes: string;
  imgSize: number;
  constructor() {}

  ngOnInit(): void {}
}
