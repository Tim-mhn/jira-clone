import { Component, Input, OnInit } from '@angular/core';
import { PatchTaskAPI } from '../../../core/apis/patch-task.api';
import { UNASSIGNED_TASK_ID_DTO } from '../../../core/dtos/task.dto';
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
  @Input() set projectMembers(_members: ProjectMember[]) {
    const members = _members || [];
    this.membersOptions = [
      {
        Email: '',
        Id: UNASSIGNED_TASK_ID_DTO,
        Name: 'Unassigned',
        Icon: '',
      },
      ...members,
    ];
  }

  membersOptions: ProjectMember[];

  constructor(private patchTaskAPI: PatchTaskAPI) {}

  ngOnInit(): void {}

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
