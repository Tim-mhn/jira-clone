import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { ProjectMember, SprintInfo, Task } from '../../../../core/models';
import { Project } from '../../../../core/models/project';
import { buildTaskPageRoute } from '../../../../core/utils/build-task-page-route.util';

@Component({
  selector: 'jira-task-details',
  templateUrl: './task-details.component.html',
})
export class TaskDetailsComponent implements OnInit, OnChanges {
  @Input() task: Task;
  @Input() project: Project;
  @Input() members: ProjectMember[];
  @Input() sprints: SprintInfo[];
  @Input() withCloseIcon: boolean;

  @Output() crossClicked = new EventEmitter<void>();
  constructor() {}

  ngOnInit(): void {}

  taskPageRoute: string[] = [];
  ngOnChanges(): void {
    if (!this.task || !this.project) return;

    this.taskPageRoute = buildTaskPageRoute(this.task, this.project);
  }
}
