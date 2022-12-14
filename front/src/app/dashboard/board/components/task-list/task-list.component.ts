import { Component, Input, OnInit } from '@angular/core';
import { PatchTaskAPI } from '../../../core/apis/patch-task.api';
import { ProjectMember } from '../../../core/models/project-member';
import { Task, Tasks } from '../../../core/models/task';
import { TaskStatus } from '../../../core/models/task-status';

@Component({
  selector: 'jira-task-list',
  templateUrl: './task-list.component.html',
})
export class TaskListComponent implements OnInit {
  @Input() tasks: Tasks;
  @Input() allStatus: TaskStatus[];
  @Input() currentProjectId: string;
  @Input() projectMembers: ProjectMember[];

  constructor(private patchTaskAPI: PatchTaskAPI) {}

  ngOnInit(): void {}

  updateTaskStatus(task: Task, newStatus: TaskStatus) {
    this.patchTaskAPI
      .updateTask({
        projectId: this.currentProjectId,
        statusId: newStatus.Id,
        taskId: task.Id,
      })
      .subscribe(() => {
        task.updateStatus(newStatus);
      });
  }

  updateTaskAssignee(task: Task, newAssignee: ProjectMember) {
    this.patchTaskAPI
      .updateTask({
        projectId: this.currentProjectId,
        taskId: task.Id,
        assigneeId: newAssignee.Id,
      })
      .subscribe(() => {
        task.updateAssignee(newAssignee);
      });
  }
}
