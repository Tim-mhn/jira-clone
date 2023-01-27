import { Component, Input, OnInit } from '@angular/core';
import { UpdateTaskController } from '../../../controllers/update-task.controller';
import { ProjectMember } from '../../../models/project-member';
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
  @Input('assigneeOptions') set _assigneeOptions(_members: ProjectMember[]) {
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

  assigneeOptions: ProjectMember[];

  ngOnInit(): void {}

  updateTaskAssignee(newAssignee: ProjectMember) {
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
