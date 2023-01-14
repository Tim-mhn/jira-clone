import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TaskCommandsAPI } from '../../../core/apis/task-commands.api';
import { TaskPositionController } from '../../../core/controllers/task-position.controller';
import { Project } from '../../../core/models/project';
import { ProjectMember } from '../../../core/models/project-member';
import { SprintInfo } from '../../../core/models/sprint';
import { Task, Tasks } from '../../../core/models/task';

@Component({
  selector: 'jira-task-list',
  templateUrl: './task-list.component.html',
})
export class TaskListComponent implements OnInit {
  @Input() project: Project;
  @Input() tasks: Tasks;
  @Input() members: ProjectMember[];
  @Input() sprints: SprintInfo[];
  @Output() taskClicked = new EventEmitter<Task>();

  constructor(
    private taskAPI: TaskCommandsAPI,
    private taskPositionController: TaskPositionController
  ) {}

  ngOnInit(): void {}

  trackById = (_index: number, t: Task) => t.Id;

  updateTaskAssignee(task: Task, newAssignee: ProjectMember) {
    this.taskAPI
      .updateTask({
        projectId: this.project.Id,
        taskId: task.Id,
        assigneeId: newAssignee.Id,
      })
      .subscribe(() => {
        task.updateAssignee(newAssignee);
      });
  }

  moveTaskInSprint(e: CdkDragDrop<Tasks, Task, Task>) {
    moveItemInArray(this.tasks, e.previousIndex, e.currentIndex);
    const newPosition = e.currentIndex;
    const { Id: taskMovedId } = e.item.data;
    const precedingTask = this.tasks[newPosition - 1];
    const followingTask = this.tasks[newPosition + 1];

    this.taskPositionController
      .moveTaskInSprint({
        taskId: taskMovedId,
        nextTaskId: followingTask?.Id,
        previousTaskId: precedingTask?.Id,
      })
      .subscribe();
  }
}
