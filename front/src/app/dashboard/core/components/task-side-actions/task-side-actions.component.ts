import { Component, Input, OnInit } from '@angular/core';
import { TypedChanges } from '@tim-mhn/common/extra-types';
import { Observable } from 'rxjs';
import { CurrentSprintsService } from '../../../board/state-services/current-sprints.service';
import { DeleteTaskController } from '../../controllers/delete-task.controller';
import { UpdateTaskController } from '../../controllers/update-task.controller';
import { SprintInfo } from '../../models/sprint';
import { Task } from '../../models/task';

@Component({
  selector: 'jira-task-side-actions',
  templateUrl: './task-side-actions.component.html',
})
export class TaskSideActionsComponent implements OnInit {
  @Input() task: Task;
  @Input() sprints: SprintInfo[];

  constructor(
    private deleteTaskController: DeleteTaskController,
    private updateTaskController: UpdateTaskController,
    private sprintsService: CurrentSprintsService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: TypedChanges<TaskSideActionsComponent>) {
    if (changes?.task)
      this.otherSprints$ = this.sprintsService.getSprintsTaskDoesNotBelongTo$(
        this.task.Id
      );
  }

  otherSprints$: Observable<SprintInfo[]>;

  deleteTask(e: Event) {
    e.stopPropagation();
    this.deleteTaskController.deleteTask(this.task.Id).subscribe();
  }

  moveTaskToSprint(sprintId: string) {
    this.updateTaskController
      .moveTaskToSprint({
        taskId: this.task.Id,
        sprintId,
      })
      .subscribe();
  }
}
