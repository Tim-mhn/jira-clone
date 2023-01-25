import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { finalize } from 'rxjs';
import { UpdateTaskController } from '../../../controllers/update-task.controller';
import { Task } from '../../../models/task';
import { TaskStatus } from '../../../models/task-status';

@Component({
  selector: 'jira-task-status-selector',
  templateUrl: './task-status-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskStatusSelectorComponent implements OnInit {
  @Input() task: Task;
  @Input() allStatus: TaskStatus[];

  constructor(
    private controller: UpdateTaskController,
    private cdr: ChangeDetectorRef
  ) {}

  updateTaskStatus(task: Task, newStatus: TaskStatus) {
    this.controller
      .updateTaskStatus(task.Id, newStatus)
      .pipe(
        finalize(() => {
          console.log('detect changes');
          this.cdr.detectChanges();
        })
      )
      .subscribe(() => {
        console.log('sub');
        task.updateStatus(newStatus);
      });
  }

  ngOnInit(): void {}

  stopPropagation = (e: Event) => e.stopPropagation();
}
