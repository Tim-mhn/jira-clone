import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Sprint } from '../../../../../core/models';

@Component({
  selector: 'jira-sprint-side-actions',
  templateUrl: './sprint-side-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SprintSideActionsComponent implements OnInit {
  @Input() sprint: Sprint;
  constructor() {}

  ngOnInit(): void {}
}
