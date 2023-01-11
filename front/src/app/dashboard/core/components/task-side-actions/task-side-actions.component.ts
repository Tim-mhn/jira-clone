import { Component, Input, OnInit } from '@angular/core';
import { DeleteTaskController } from '../../controllers/delete-task.controller';
import { Task } from '../../models/task';

@Component({
  selector: 'jira-task-side-actions',
  templateUrl: './task-side-actions.component.html',
})
export class TaskSideActionsComponent implements OnInit {
  @Input() task: Task;
  constructor(private deleteTaskController: DeleteTaskController) {}

  ngOnInit(): void {}

  deleteTask(e: Event) {
    e.stopPropagation();
    this.deleteTaskController.deleteTask(this.task.Id).subscribe();
  }
}
