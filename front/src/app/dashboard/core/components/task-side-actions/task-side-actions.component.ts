import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TypedChanges } from '@tim-mhn/common/extra-types';
import { TimUIDropdownMenu } from '@tim-mhn/ng-ui/dropdown-menu';
import { ReplaySubject } from 'rxjs';
import { DeleteTaskController } from '../../controllers/delete-task.controller';
import { UpdateTaskController } from '../../controllers/update-task.controller';
import { SprintInfo } from '../../models/sprint';
import { Task } from '../../models/task';
import { getSprintsTaskDoesNotBelongTo } from '../../utils/get-other-sprints.util';

@Component({
  selector: 'jira-task-side-actions',
  templateUrl: './task-side-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskSideActionsComponent implements OnInit {
  @Input() task: Task;
  @Input() sprints: SprintInfo[];

  @ViewChild('sideActionsMenu') menu: TimUIDropdownMenu;
  constructor(
    private deleteTaskController: DeleteTaskController,
    private updateTaskController: UpdateTaskController
  ) {}

  ngOnInit(): void {}

  ngOnChanges(_changes: TypedChanges<TaskSideActionsComponent>) {
    if (!this.task) return;
    const otherSprints = getSprintsTaskDoesNotBelongTo(this.task, this.sprints);
    this.otherSprints$.next(otherSprints);
  }

  public otherSprints$ = new ReplaySubject<SprintInfo[]>();

  deleteTask(e: Event) {
    e.stopPropagation();
    this.menu.close();
    this.deleteTaskController.deleteTask(this.task.Id).subscribe();
  }

  moveTaskToSprint(sprintId: string) {
    this.menu.close();

    this.updateTaskController
      .moveTaskToSprint({
        taskId: this.task.Id,
        sprintId,
      })
      .subscribe();
  }
}
