import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { TaskType } from '../../../models/task-type';

@Component({
  selector: 'jira-task-type-tag',
  templateUrl: './task-type-tag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTypeTagComponent implements OnInit {
  @Input() taskType: TaskType;

  constructor() {}

  ngOnInit(): void {}
}
