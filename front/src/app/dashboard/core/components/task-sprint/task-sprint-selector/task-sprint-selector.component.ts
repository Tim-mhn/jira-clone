import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { SprintInfo, Task } from '../../../models';

@Component({
  selector: 'jira-task-sprint-selector',
  templateUrl: './task-sprint-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskSprintSelectorComponent implements OnInit {
  @Input() task: Task;
  @Input() activeSprints: SprintInfo[];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  updateUI() {
    this.cdr.detectChanges();
  }
}
