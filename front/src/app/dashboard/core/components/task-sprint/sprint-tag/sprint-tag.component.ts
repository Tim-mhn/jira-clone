import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { SprintIdName } from '../../../models';

@Component({
  selector: 'jira-sprint-tag',
  templateUrl: './sprint-tag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SprintTagComponent implements OnInit {
  @Input() sprint: SprintIdName;
  constructor() {}

  ngOnInit(): void {}
}
