import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TypedChanges } from '@tim-mhn/common/extra-types';
import { takeUntil } from 'rxjs';
import { User } from '../../../../../auth/models/user';
import { SubscriptionHandler } from '../../../../../shared/services/subscription-handler.service';
import { UpdateTaskController } from '../../../controllers/update-task.controller';
import { Task } from '../../../models/task';

@Component({
  selector: 'jira-task-assignee-selector',
  templateUrl: './task-assignee-selector.component.html',
  host: {
    class: 'w-fit h-fit h-5.5',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskAssigneeSelectorComponent
  implements OnInit, OnChanges, OnDestroy
{
  constructor(
    private controller: UpdateTaskController,
    private cdr: ChangeDetectorRef
  ) {}

  @Input() task: Task;
  @Input('assigneeOptions') set _assigneeOptions(_members: User[]) {
    const members = _members || [];
    this.assigneeOptions = [
      {
        Email: '',
        Id: null,
        Name: 'Unassigned',
        Icon: '',
      },
      ...members,
    ];
  }

  private _subscriptionHandler = new SubscriptionHandler();

  assigneeOptions: User[];

  ngOnInit(): void {}

  ngOnChanges(ch: TypedChanges<TaskAssigneeSelectorComponent>) {
    if (ch.task && !!this.task) this._updateUIOnTaskUpdates();
  }

  private _updateUIOnTaskUpdates() {
    this.task.update$
      .pipe(takeUntil(this._subscriptionHandler.onDestroy$))
      .subscribe(() => this.cdr.detectChanges());
  }

  updateTaskAssignee(newAssignee: User) {
    this.controller.updateTaskAssignee(this.task, newAssignee).subscribe(() => {
      this.task.updateAssignee(newAssignee);
    });
  }

  ngOnDestroy() {
    this._subscriptionHandler.destroy();
  }
}
