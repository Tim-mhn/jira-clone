import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PatchTaskAPI } from '../../../core/apis/patch-task.api';
import { Project } from '../../../core/models/project';
import { ProjectMember } from '../../../core/models/project-member';
import { Task, Tasks } from '../../../core/models/task';
import { CurrentProjectService } from '../../state-services/current-project.service';

@Component({
  selector: 'jira-task-list',
  templateUrl: './task-list.component.html',
})
export class TaskListComponent implements OnInit {
  @Input() project: Project;
  @Input() tasks: Tasks;
  @Output() taskClicked = new EventEmitter<Task>();

  constructor(
    private patchTaskAPI: PatchTaskAPI,
    private currentProjectService: CurrentProjectService
  ) {}

  ngOnInit(): void {}

  project$ = this.currentProjectService.currentProject$;

  updateTaskAssignee(task: Task, newAssignee: ProjectMember) {
    this.patchTaskAPI
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
