import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { UpdateTaskController } from '../../../controllers/update-task.controller';
import { SprintInfo, Task } from '../../../models';
import { getSprintsTaskDoesNotBelongTo } from '../../../utils/get-other-sprints.util';

@Component({
  selector: 'jira-move-tasks-to-sprint-menu-items',
  templateUrl: './move-tasks-to-sprint-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'sprintsMenu',
})
export class MoveTasksToSprintMenuItemsComponent implements OnInit {
  @Input() task: Task;
  @Input() activeSprints: SprintInfo[];
  constructor(
    private controller: UpdateTaskController,
    private cdr: ChangeDetectorRef
  ) {}

  @Output() taskMoved = new EventEmitter<SprintInfo>();

  otherSprints: SprintInfo[] = [];
  ngOnInit(): void {}

  ngOnChanges() {
    if (this.task && this.activeSprints)
      this.otherSprints = getSprintsTaskDoesNotBelongTo(
        this.task,
        this.activeSprints
      );
  }

  moveTaskToSprint(sprint: SprintInfo) {
    this.controller
      .moveTaskToSprint({
        task: this.task,
        sprint,
      })
      .subscribe(() => {
        this.updateTaskSprintAndOtherListOfOtherSprints(sprint);
      });
  }

  updateTaskSprintAndOtherListOfOtherSprints(sprint: SprintInfo) {
    this.task.moveTaskToSprint(sprint);
    this.otherSprints = getSprintsTaskDoesNotBelongTo(
      this.task,
      this.activeSprints
    );
    this.taskMoved.emit(sprint);
    this.cdr.detectChanges();
  }
}
