import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TypedChanges } from '@tim-mhn/common/extra-types';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { ICONS } from '@tim-mhn/common/icons';
import { TypedFormBuilder } from '@tim-mhn/common/typed-forms';
import {
  catchError,
  distinctUntilChanged,
  EMPTY,
  filter,
  switchMap,
  tap,
} from 'rxjs';
import { UpdateTaskController } from '../../../../../core/controllers/update-task.controller';
import { Task } from '../../../../../core/models';

@Component({
  selector: 'jira-task-editable-title',
  templateUrl: './task-editable-title.component.html',
})
export class TaskEditableTitleComponent implements OnInit, OnChanges {
  readonly SUCCESS_ICON = ICONS.CHECK_CIRCLE_GREEN;
  readonly ERROR_ICON = ICONS.EXCLAMATION_CIRCLE_RED;

  @Input() task: Task;
  @Input() title: string;
  // todo? "ObservePropertyChange" style to avoid having task and a property of task as inputs

  titleFc = this.tfb.control('', Validators.required);

  requestState = new RequestState();
  constructor(
    private tfb: TypedFormBuilder,
    private controller: UpdateTaskController,
    private requestStateController: RequestStateController
  ) {}

  ngOnInit(): void {
    this._updateTitleOnUserInput();
  }

  ngOnChanges(ch: TypedChanges<TaskEditableTitleComponent>) {
    if (ch.title) {
      this.titleFc.setValue(this.task.Title, { emitEvent: false });
    }
  }

  private _updateTitleOnUserInput() {
    this.titleFc.valueChanges
      .pipe(
        filter(() => this.titleFc.valid),
        // mark request as pending as soon as user types in
        distinctUntilChanged(),
        tap(() => this.requestState.toPending()),
        switchMap((newTitle) =>
          this.updateTaskTitle(newTitle).pipe(
            this.requestStateController.handleRequest(this.requestState),
            catchError(() => EMPTY) // make sure to add this to not kill the observable if there is an error from the API
          )
        )
      )
      .subscribe(() => this.task.updateTitle(this.titleFc.value));
  }

  updateTaskTitle(newTitle: string) {
    return this.controller.updateTask({
      taskId: this.task.Id,
      title: newTitle,
    });
  }
}
