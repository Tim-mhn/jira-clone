import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { TypedChanges } from '@tim-mhn/common/extra-types';
import { TooltipPosition } from '@tim-mhn/ng-ui/tooltip';
import { takeUntil } from 'rxjs';
import { SubscriptionHandler } from '../../../../../shared/services/subscription-handler.service';
import { UpdateTaskController } from '../../../controllers/update-task.controller';
import { Task } from '../../../models';
import { TaskType } from '../../../models/task-type';

@Component({
  selector: 'jira-task-type-selector',
  templateUrl: './task-type-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTypeSelectorComponent implements OnInit, OnChanges {
  @Input() task: Task;
  @Input() allTypes: TaskType[] = [];
  constructor(
    private cdr: ChangeDetectorRef,
    private controller: UpdateTaskController
  ) {}

  private _subHandler = SubscriptionHandler.New();

  readonly TASK_TYPE_TOOLTIP_POSITION = TooltipPosition.TOP;

  ngOnInit(): void {}

  ngOnChanges(changes: TypedChanges<TaskTypeSelectorComponent>) {
    if (changes?.task && this.task) this._updateUIOnTaskChanges();
  }

  private _updateUIOnTaskChanges() {
    this.task.update$
      .pipe(takeUntil(this._subHandler.onDestroy$))
      .subscribe(() => this.cdr.detectChanges());
  }

  updateTaskType(type: TaskType) {
    this.controller.updateTaskType(this.task, type).subscribe(() => {
      this.task.updateType(type);
      this.cdr.detectChanges();
    });
  }
}
