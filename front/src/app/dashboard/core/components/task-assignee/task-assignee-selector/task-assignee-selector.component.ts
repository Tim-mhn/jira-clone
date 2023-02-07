import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../../../auth/models/user';
import { UpdateTaskController } from '../../../controllers/update-task.controller';
import { Task } from '../../../models/task';

@Component({
  selector: 'jira-task-assignee-selector',
  templateUrl: './task-assignee-selector.component.html',
  host: {
    class: 'w-fit h-fit h-5.5',
  },
})
export class TaskAssigneeSelectorComponent implements OnInit {
  constructor(private controller: UpdateTaskController) {}

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

  assigneeOptions: User[];

  ngOnInit(): void {}

  updateTaskAssignee(newAssignee: User) {
    this.controller
      .updateTask({
        taskId: this.task.Id,
        assigneeId: newAssignee.Id,
      })
      .subscribe(() => {
        this.task.updateAssignee(newAssignee);
      });
  }
}
