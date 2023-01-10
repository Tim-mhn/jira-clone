import { Component, HostListener, Input, OnInit } from '@angular/core';
import { TypedFormBuilder } from '@tim-mhn/common/typed-forms';
import { CreateTaskController } from '../../../../core/controllers/create-task.controller';
import { Sprint } from '../../../../core/models/sprint';

@Component({
  selector: 'jira-create-task-row',
  templateUrl: './create-task-row.component.html',
})
export class CreateTaskRowComponent implements OnInit {
  @Input() sprint: Sprint;
  constructor(
    private tfb: TypedFormBuilder,
    private controller: CreateTaskController
  ) {}

  ngOnInit(): void {}

  createTaskMode = false;

  taskTitleFc = this.tfb.control('');

  toggleCreateTaskMode = () => (this.createTaskMode = !this.createTaskMode);

  @HostListener('keydown.enter')
  createTaskOnEnter() {
    if (!this.createTaskMode) return;

    this.toggleCreateTaskMode();

    this.controller
      .createTask({
        assigneeId: '',
        sprintId: this.sprint.Id,
        title: this.taskTitleFc.value,
      })
      .subscribe({
        error: () => this.toggleCreateTaskMode(),
      });
  }
}
