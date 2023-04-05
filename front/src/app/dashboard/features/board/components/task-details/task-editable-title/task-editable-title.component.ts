import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { TypedChanges } from '@tim-mhn/common/extra-types';
import { RequestState } from '@tim-mhn/common/http';
import { ICONS } from '@tim-mhn/common/icons';
import { TypedFormBuilder } from '@tim-mhn/common/typed-forms';
import { TagTemplateBuilder } from '@tim-mhn/ng-forms/autocomplete';
import {
  catchError,
  distinctUntilChanged,
  EMPTY,
  filter,
  switchMap,
} from 'rxjs';
import { UpdateTaskController } from '../../../../../core/controllers/update-task.controller';
import { Task } from '../../../../../core/models';
import { TaskTags } from '../../../../tags';

@Component({
  selector: 'jira-task-editable-title',
  templateUrl: './task-editable-title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskEditableTitleComponent implements OnInit, OnChanges {
  readonly SUCCESS_ICON = ICONS.CHECK_CIRCLE_GREEN;
  readonly ERROR_ICON = ICONS.EXCLAMATION_CIRCLE_RED;

  @Input() task: Task;
  @Input() title: string;
  @Input() tags: TaskTags;
  @Input() tagTemplate: TagTemplateBuilder;

  titleFc = this.tfb.control('', Validators.required);

  focused = false;
  onClick() {
    if (this.focused) return;
    this.focused = true;
    this.titleFc.setValue(this.task.RawTitle, { emitEvent: false });
  }

  requestState = new RequestState();
  constructor(
    private tfb: TypedFormBuilder,
    private controller: UpdateTaskController,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._updateTitleOnUserInput();
  }

  ngOnChanges(ch: TypedChanges<TaskEditableTitleComponent>) {
    if (ch.title) {
      this.titleFc.setValue(this.task.RawTitle, { emitEvent: false });
    }
  }

  private _updateTitleOnUserInput() {
    this.titleFc.valueChanges
      .pipe(
        filter(() => this.titleFc.valid),
        // mark request as pending as soon as user types in
        distinctUntilChanged(),
        switchMap((newTitle) =>
          this.updateTaskTitle(newTitle).pipe(catchError(() => EMPTY))
        )
      )
      .subscribe(({ Title, RawTitle, Tags }) => {
        this.task.updateTitle({ Title, RawTitle });
        this.task.updateTags(Tags);
        this.cdr.detectChanges();
      });
  }

  updateTaskTitle(newTitle: string) {
    return this.controller.updateTaskTitle(
      {
        taskId: this.task.Id,
        title: newTitle,
      },
      this.requestState
    );
  }
}
