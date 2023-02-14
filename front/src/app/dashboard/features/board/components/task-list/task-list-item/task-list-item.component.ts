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
  ngOnInit(): void {}

  ngOnChanges(ch: TypedChanges<TaskListItemComponent>) {
    if (ch.task && this.task) {
      this.titleFc.setValue(this.task.Title, { emitEvent: false });
      this.pointsFc.setValue(this.task.Points, { emitEvent: false });
    }
  }

  markOptionsHaveBeenClicked() {
    this.optionHasBeenClicked = true;
  }
  optionHasBeenClicked = false;
  updateTitleIfNoOptionIsClicked() {
    const delay = 200;
    setTimeout(() => {
      if (this.optionHasBeenClicked) this.optionHasBeenClicked = false;
      else this.updateTitle();
    }, delay);
  }

  updateTitle(event?: Event) {
    event?.stopPropagation();
    this.cancelEditMode({ resetControlValue: false });
    const newTitle = this.titleFc.value;
    this.controller
      .updateTask(
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
      .subscribe(() => {
        this.task.updateTitle(newTitle);
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

  log = console.log;

  cancelEditMode(
    opts: { resetControlValue: boolean } = { resetControlValue: true }
  ) {
    if (opts?.resetControlValue)
      this.titleFc.setValue(this.task.Title, { emitEvent: false });
    this.editTitleModeActive = false;
  }
}
