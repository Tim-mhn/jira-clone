import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TimUIDropdownMenu } from '@tim-mhn/ng-ui/dropdown-menu';
import { DeleteTaskController } from '../../controllers/delete-task.controller';
import { SprintInfo } from '../../models/sprint';
import { Task } from '../../models/task';

@Component({
  selector: 'jira-task-side-actions',
  templateUrl: './task-side-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskSideActionsComponent implements OnInit {
  @Input() task: Task;
  @Input() sprints: SprintInfo[];

  @ViewChild('sideActionsMenu') menu: TimUIDropdownMenu;
  constructor(private deleteTaskController: DeleteTaskController) {}

  ngOnInit(): void {}

  deleteTask(e: Event) {
    e.stopPropagation();
    this.menu.close();
    this.deleteTaskController.deleteTask(this.task.Id).subscribe();
  }
}
