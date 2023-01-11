import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ICONS } from '@tim-mhn/common/icons';
import { TypedFormBuilder } from '@tim-mhn/common/typed-forms';
import { CreateTaskController } from '../../../../core/controllers/create-task.controller';
import { Sprint } from '../../../../core/models/sprint';

@Component({
  selector: 'jira-create-task-row',
  templateUrl: './create-task-row.component.html',
})
export class CreateTaskRowComponent implements OnInit {
  readonly PLUS_ICON = ICONS.PLUS_BLUE;
  @Input() sprint: Sprint;
  constructor(
    private tfb: TypedFormBuilder,
    private controller: CreateTaskController
  ) {}

  ngOnInit(): void {}

  createTaskMode = false;

  taskTitleFc = this.tfb.control('');

  activateCreateTaskMode = (event?: Event) => {
    event?.stopPropagation();
    this.toggleCreateTaskMode(true);
  };
  deactivateCreateTaskMode = () => this.toggleCreateTaskMode(false);
  toggleCreateTaskMode = (active: boolean) => (this.createTaskMode = active);

  stopPropagation = (e: Event) => e?.stopPropagation();

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
        error: () => this.activateCreateTaskMode(),
      });
  }

  @HostListener('document:click')
  onClick() {
    this.deactivateCreateTaskMode();
  }

  @HostListener('keydown.escape')
  onEscape() {}
}
