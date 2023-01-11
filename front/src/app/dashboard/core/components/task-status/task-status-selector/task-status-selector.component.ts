import { Component, Input, OnInit } from '@angular/core';
import { TaskCommandsAPI } from '../../../apis/task-commands.api';
import { Task } from '../../../models/task';
import { TaskStatus } from '../../../models/task-status';

@Component({
  selector: 'jira-task-status-selector',
  templateUrl: './task-status-selector.component.html',
})
export class TaskStatusSelectorComponent implements OnInit {
  @Input() task: Task;
  @Input() projectId: string;
  @Input() allStatus: TaskStatus[];

  constructor(private taskAPI: TaskCommandsAPI) {}

  updateTaskStatus(task: Task, newStatus: TaskStatus) {
    this.taskAPI
      .updateTask({
        projectId: this.projectId,
        status: newStatus.Id,
        taskId: task.Id,
      })
      .subscribe(() => {
        task.updateStatus(newStatus);
      });
  }

  ngOnInit(): void {}

  stopPropagation = (e: Event) => e.stopPropagation();
}
