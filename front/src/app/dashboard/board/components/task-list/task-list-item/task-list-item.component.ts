import {
  Component,
  HostListener,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { TypedChanges } from '@tim-mhn/common/extra-types';
import { RequestState } from '@tim-mhn/common/http';
import { TypedFormBuilder } from '@tim-mhn/common/typed-forms';
import { DeleteTaskController } from '../../../../core/controllers/delete-task.controller';
import { UpdateTaskController } from '../../../../core/controllers/update-task.controller';
import { Project } from '../../../../core/models/project';
import { Task } from '../../../../core/models/task';

@Component({
  selector: 'jira-task-list-item',
  templateUrl: './task-list-item.component.html',
})
export class TaskListItemComponent implements OnInit, OnChanges {
  @Input() task: Task;
  @Input() project: Project;

  constructor(
    private tfb: TypedFormBuilder,
    private controller: UpdateTaskController,
    private deleteController: DeleteTaskController
  ) {}

  titleFc = this.tfb.control('');
  pointsFc = this.tfb.control<number>(null);
  editTitleModeActive = false;
  requestState = new RequestState();

  ngOnInit(): void {}

  ngOnChanges(ch: TypedChanges<TaskListItemComponent>) {
    if (ch.task) {
      this.titleFc.setValue(this.task.Title, { emitEvent: false });
      this.pointsFc.setValue(this.task.Points, { emitEvent: false });
    }
  }

  updateTitle(event?: Event) {
    event.stopPropagation();
    this.cancelEditModeOnDocumentClick({ resetControlValue: false });
    const newTitle = this.titleFc.value;
    this.controller
      .updateTask(
        {
          taskId: this.task.Id,
          title: newTitle,
        },
        this.requestState
      )
      .subscribe(() => this.task.updateTitle(newTitle));
  }

  activateEditMode(event: Event) {
    this.editTitleModeActive = true;
    event.stopPropagation();
    event.preventDefault();
  }

  stopPropagation = (event: Event) => event.stopPropagation();

  @HostListener('document:click')
  cancelEditModeOnDocumentClick(
    opts: { resetControlValue: boolean } = { resetControlValue: true }
  ) {
    if (opts?.resetControlValue)
      this.titleFc.setValue(this.task.Title, { emitEvent: false });
    this.editTitleModeActive = false;
  }
}
