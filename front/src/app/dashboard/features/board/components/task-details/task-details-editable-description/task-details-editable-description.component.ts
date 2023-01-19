import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { TypedChanges } from '@tim-mhn/common/extra-types';
import { RequestState } from '@tim-mhn/common/http';
import { TypedFormBuilder } from '@tim-mhn/common/typed-forms';
import { UpdateTaskController } from '../../../../../core/controllers/update-task.controller';
import { Task } from '../../../../../core/models/task';

@Component({
  selector: 'jira-task-details-editable-description',
  templateUrl: './task-details-editable-description.component.html',
})
export class TaskDetailsEditableDescriptionComponent
  implements OnInit, OnChanges
{
  @Input() task: Task;

  constructor(
    private tfb: TypedFormBuilder,
    private controller: UpdateTaskController
  ) {}
  descriptionFc = this.tfb.control('');
  requestState = new RequestState();

  ngOnInit(): void {}

  ngOnChanges(ch: TypedChanges<TaskDetailsEditableDescriptionComponent>) {
    if (ch.task) {
      this.descriptionFc.setValue(this.task.Description);
    }
  }

  cancelDescriptionChanges() {
    this.descriptionFc.setValue(this.task.Description);
  }

  saveDescriptionChanges() {
    const dto = {
      taskId: this.task.Id,
      description: this.descriptionFc.value,
    };
    this.controller
      .updateTask(dto, this.requestState)
      .subscribe(() => this.task.updateDescription(this.descriptionFc.value));
  }
}
