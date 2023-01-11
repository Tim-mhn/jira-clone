import { Component, Input, OnInit } from '@angular/core';
import { TaskCommandsAPI } from '../../../apis/task-commands.api';
import { ProjectMember } from '../../../models/project-member';
import { Task } from '../../../models/task';

@Component({
  selector: 'jira-task-assignee-selector',
  templateUrl: './task-assignee-selector.component.html',
  host: {
    class: 'w-fit h-fit',
  },
})
export class TaskAssigneeSelectorComponent implements OnInit {
  constructor(private taskAPI: TaskCommandsAPI) {}

  @Input() task: Task;
  @Input() projectId: string;
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
    this.taskAPI
      .updateTask({
        projectId: this.projectId,
        taskId: this.task.Id,
        assigneeId: newAssignee.Id,
      })
      .subscribe(() => {
        this.task.updateAssignee(newAssignee);
      });
  }
}
