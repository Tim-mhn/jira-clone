import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { User } from '../../../../auth/models/user';

@Component({
  selector: 'jira-member-icon',
  templateUrl: './member-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberIconComponent implements OnInit {
  readonly EMPTY_MEMBER_ICON = 'assets/icons/user.png';
  @Input() member: User;
  @Input() set size(s: 'sm' | 'md') {
    this.imgSize = s === 'md' ? 24 : 20;
    this.classes = s === 'md' ? 'h-6 w-6' : 'h-5 w-5';
  }

  @Input() showTooltip = false;

  classes: string;
  imgSize: number;
  constructor() {}

  ngOnInit(): void {}
}
