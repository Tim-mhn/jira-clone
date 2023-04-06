import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TypedChanges } from '@tim-mhn/common/extra-types';
import { RequestState } from '@tim-mhn/common/http';
import { TypedFormBuilder } from '@tim-mhn/common/typed-forms';
import { TimHtmlInput } from '@tim-mhn/ng-forms/autocomplete';
import { finalize } from 'rxjs';
import { UpdateTaskController } from '../../../../../core/controllers/update-task.controller';
import {
  Project,
  ProjectMember,
  SprintInfo,
  Task,
} from '../../../../../core/models';
import { TaskTagsController } from '../../../../tags/task-tags.controller';

@Component({
  selector: 'jira-task-list-item',
  templateUrl: './task-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListItemComponent implements OnInit, OnChanges {
  @Input() task: Task;
  @Input() project: Project;
  @Input() members: ProjectMember[] = [];
  @Input() sprints: SprintInfo[];

  show = false;
  constructor(
    private tfb: TypedFormBuilder,
    private controller: UpdateTaskController,
    private cdr: ChangeDetectorRef,
    private tagsController: TaskTagsController
  ) {}

  @ViewChild('titleInput') titleInput: TimHtmlInput;

  titleFc = this.tfb.control('');
  pointsFc = this.tfb.control<number>(null);
  editTitleModeActive = false;
  requestState = new RequestState();

  tagTemplate$ = this.tagsController.getTagTemplateFn();
  tags$ = this.tagsController.getProjectTags();

  ngOnInit(): void {}

  ngOnChanges(ch: TypedChanges<TaskListItemComponent>) {
    if (ch.task && this.task) {
      this.titleFc.setValue(this.task.Title, { emitEvent: false });
      this.pointsFc.setValue(this.task.Points, { emitEvent: false });
    }
  }

  createNewTag(newTag: string) {
    this.tagsController.createTagAndUpdateList(newTag).subscribe();
  }

  markOptionHasBeenClicked() {
    this.optionHasBeenClicked = true;
  }
  optionHasBeenClicked = false;
  updateTitleIfBlurTriggeredByOutsideClick() {
    const delay = 200;

    setTimeout(() => {
      if (this.blurTriggeredByHashtagOptionClick)
        this._ignoreBlurAndResetOptionClicked();
      else if (this.blurTriggeredByCancelButton)
        this.ignoreBlurAndResetCancelHasBeenClicked();
      else this.updateTitle();
    }, delay);
  }

  private get blurTriggeredByHashtagOptionClick() {
    return this.optionHasBeenClicked;
  }
  private _ignoreBlurAndResetOptionClicked() {
    this.optionHasBeenClicked = false;
  }

  updateTitle(event?: Event) {
    event?.stopPropagation();
    this.cancelEditMode({ resetControlValue: false });
    const newTitle = this.titleFc.value;
    this.controller
      .updateTaskTitle(
        {
          taskId: this.task.Id,
          title: newTitle,
        },
        this.requestState
      )
      .pipe(
        finalize(() => {
          this.cdr.detectChanges();
        })
      )
      .subscribe(({ Title, RawTitle }) => {
        this.task.updateTitle({ Title, RawTitle });
      });
  }

  activateEditMode(event: Event) {
    this.editTitleModeActive = true;
    this.stopPropagation(event);
    event.preventDefault();
    setTimeout(() => this.titleInput.focusInput());
  }

  stopPropagation = (event: Event) => event.stopPropagation();

  @HostListener('document:click')
  cancelEditModeOnDocumentClick() {
    this.cancelEditMode();
  }

  cancelEditMode(
    opts: { resetControlValue: boolean } = { resetControlValue: true }
  ) {
    this.cancelHasBeenClicked = true;
    if (opts?.resetControlValue)
      this.titleFc.setValue(this.task.Title, { emitEvent: false });
    this.editTitleModeActive = false;
  }

  cancelHasBeenClicked = false;
  private get blurTriggeredByCancelButton() {
    return this.cancelHasBeenClicked;
  }

  ignoreBlurAndResetCancelHasBeenClicked() {
    this.cancelHasBeenClicked = false;
  }
}
