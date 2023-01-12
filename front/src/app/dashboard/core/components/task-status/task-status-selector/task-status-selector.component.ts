import { Component, Input, OnInit } from '@angular/core';
import { UpdateTaskController } from '../../../controllers/update-task.controller';
import { Task } from '../../../models/task';
import { TaskStatus } from '../../../models/task-status';

@Component({
  selector: 'jira-task-status-selector',
  templateUrl: './task-status-selector.component.html',
})
export class TaskStatusSelectorComponent implements OnInit {
  @Input() task: Task;
  @Input() allStatus: TaskStatus[];

  constructor(private controller: UpdateTaskController) {}

  updateTaskStatus(task: Task, newStatus: TaskStatus) {
    this.controller.updateTaskStatus(task.Id, newStatus).subscribe(() => {
      task.updateStatus(newStatus);
    });
  }

  ngOnInit(): void {}

  stopPropagation = (e: Event) => e.stopPropagation();
}
