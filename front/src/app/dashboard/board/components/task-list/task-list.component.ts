import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TaskCommandsAPI } from '../../../core/apis/task-commands.api';
import { Project } from '../../../core/models/project';
import { ProjectMember } from '../../../core/models/project-member';
import { SprintInfo } from '../../../core/models/sprint';
import { Task, Tasks } from '../../../core/models/task';
import { CurrentProjectService } from '../../state-services/current-project.service';

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
    private currentProjectService: CurrentProjectService
  ) {}

  ngOnInit(): void {}

  project$ = this.currentProjectService.currentProject$;

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
}
