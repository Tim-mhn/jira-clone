import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { TypedChanges } from '@tim-mhn/common/extra-types';
import { TypedFormBuilder } from '@tim-mhn/common/typed-forms';
import { distinctUntilChanged, filter, switchMap } from 'rxjs';
import { UpdateTaskController } from '../../controllers/update-task.controller';
import { Task } from '../../models/task';

@Component({
  selector: 'jira-task-points-chip',
  templateUrl: './task-points-chip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskPointsChipComponent implements OnInit, OnChanges {
  @Input() task: Task;
  @Input() taskPoints: number;

  constructor(
    private tfb: TypedFormBuilder,
    private controller: UpdateTaskController
  ) {}

  ngOnInit(): void {
    this.pointsControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        filter(() => this.pointsControl.valid),
        switchMap((points) =>
          this.controller.updateTaskPoints(this.task.Id, points)
        )
      )
      .subscribe({
        next: () => this.task.updatePoints(this.pointsControl.value),
        error: (err) => {
          console.error(err);
          this.pointsControl.setValue(this.task.Points, { emitEvent: false });
        },
      });
  }

  ngOnChanges(ch: TypedChanges<TaskPointsChipComponent>) {
    if (ch?.taskPoints)
      this.pointsControl.setValue(this.taskPoints, { emitEvent: false });
  }

  pointsControl = this.tfb.control<number>(null, Validators.min(0));

  stopPropagation = (e: Event) => e.stopPropagation();
}
