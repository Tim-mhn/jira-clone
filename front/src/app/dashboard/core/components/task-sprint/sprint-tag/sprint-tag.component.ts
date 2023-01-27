import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { SprintInfo } from '../../../models';

@Component({
  selector: 'jira-sprint-tag',
  templateUrl: './sprint-tag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SprintTagComponent implements OnInit {
  @Input() sprint: SprintInfo;
  constructor() {}

  ngOnInit(): void {}
}
