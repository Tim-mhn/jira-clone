import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ICONS } from '@tim-mhn/common/icons';
import { TypedFormBuilder } from '@tim-mhn/common/typed-forms';
import { TagTemplateBuilder } from '@tim-mhn/ng-forms/autocomplete';
import { Observable } from 'rxjs';
import { CreateTaskController } from '../../../../../core/controllers/create-task.controller';
import { Sprint } from '../../../../../core/models/sprint';
import { TaskTag } from '../../../../tags';
import { TaskTagsController } from '../../../../tags/task-tags.controller';

@Component({
  selector: 'jira-create-task-row',
  templateUrl: './create-task-row.component.html',
})
export class CreateTaskRowComponent implements OnInit {
  readonly PLUS_ICON = ICONS.PLUS_BLUE;

  @Input() sprint: Sprint;

  constructor(
    private tfb: TypedFormBuilder,
    private controller: CreateTaskController,
    private tagsController: TaskTagsController
  ) {}

  ngOnInit(): void {
    this._setTagTemplate();
  }

  private _setTagTemplate() {
    this.tagTemplate$ = this.tagsController.getTagTemplateFn();
  }

  createNewTag(newTag: TaskTag) {
    this.tagsController.createTagAndUpdateList(newTag).subscribe();
  }

  allTags$ = this.tagsController.getProjectTags();

  createTaskMode = false;

  taskTitleFc = this.tfb.control('');

  activateCreateTaskMode = (event?: Event) => {
    event?.stopPropagation();
    this.toggleCreateTaskMode(true);
  };
  deactivateCreateTaskMode = () => this.toggleCreateTaskMode(false);
  toggleCreateTaskMode = (active: boolean) => (this.createTaskMode = active);

  stopPropagation = (e: Event) => e?.stopPropagation();

  tagTemplate$: Observable<TagTemplateBuilder>;

  @HostListener('keydown.enter', ['$event'])
  createTaskOnEnter(e: Event) {
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (!this.createTaskMode) return;

    this.deactivateCreateTaskMode();

    this.controller
      .createTask({
        assigneeId: '',
        sprintId: this.sprint.Id,
        title: this.taskTitleFc.value,
      })
      .subscribe({
        complete: () => this.taskTitleFc.reset(),
        error: () => this.activateCreateTaskMode(),
      });
  }

  @HostListener('document:click')
  onClick() {
    this.deactivateCreateTaskMode();
  }

  @HostListener('keydown.escape')
  onEscape() {
    this.deactivateCreateTaskMode();
  }
}
