import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TypedChanges } from '@tim-mhn/common/extra-types';
import { TypedFormBuilder } from '@tim-mhn/common/typed-forms';
import { distinctUntilChanged, switchMap } from 'rxjs';
import { UpdateTaskController } from '../../controllers/update-task.controller';
import { Task } from '../../models/task';

@Component({
  selector: 'jira-task-points-chip',
  templateUrl: './task-points-chip.component.html',
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
        switchMap((points) =>
          this.controller.updateTask({
            taskId: this.task.Id,
            points,
          })
        )
      )
      .subscribe({
        next: () => this.task.updatePoints(this.pointsControl.value),
        error: () =>
          this.pointsControl.setValue(this.task.Points, { emitEvent: false }),
      });
  }

  ngOnChanges(ch: TypedChanges<TaskPointsChipComponent>) {
    if (ch?.taskPoints)
      this.pointsControl.setValue(this.taskPoints, { emitEvent: false });
  }

  pointsControl = this.tfb.control<number>(null, Validators.min(0));

  stopPropagation = (e: Event) => e.stopPropagation();
}
