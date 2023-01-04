import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { TypedFormBuilder } from '@tim-mhn/common/typed-forms';
import { RequestState } from '@tim-mhn/common/http';
import { Validators } from '@angular/forms';
import { ProjectMember } from '../../../core/models/project-member';
import { Task } from '../../../core/models/task';
import { TaskStatus } from '../../../core/models/task-status';
import { UpdateTaskController } from '../../../core/controllers/update-task.controller';

@Component({
  selector: 'jira-task-details',
  templateUrl: './task-details.component.html',
})
export class TaskDetailsComponent implements OnInit, OnChanges {
  @Input() task: Task;
  @Input() projectId: string;
  @Input() projectMembers: ProjectMember[];
  @Input() allStatus: TaskStatus[];

  constructor(
    private tfb: TypedFormBuilder,
    private controller: UpdateTaskController
  ) {}

  requestState = new RequestState();
  titleUpdateRequestState = new RequestState();

  titleFc = this.tfb.control('', Validators.required);
  descriptionFc = this.tfb.control('');

  ngOnInit(): void {}

  cancelDescriptionChanges() {
    this.descriptionFc.setValue(this.task.Description);
  }

  saveDescriptionChanges() {
    const dto = {
      projectId: this.projectId,
      taskId: this.task.Id,
      description: this.descriptionFc.value,
    };
    this.controller
      .updateTask(dto, this.requestState)
      .subscribe(() => this.task.updateDescription(this.descriptionFc.value));
  }

  ngOnChanges(ch: SimpleChanges) {
    if (ch.task) {
      this.descriptionFc.setValue(this.task.Description);
    }
  }
}
