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
import { buildTaskPageRoute } from '../../../browse/utils/build-browse-page-routes.util';
import { TaskTagsController } from '../../../tags';

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
  constructor(private tagsController: TaskTagsController) {}

  ngOnInit(): void {}

  taskPageRoute: string[] = [];

  tagTemplate$ = this.tagsController.getTagTemplateFn();
  tags$ = this.tagsController.getProjectTags();

  ngOnChanges(): void {
    if (!this.task || !this.project) return;

    this.taskPageRoute = buildTaskPageRoute(this.task, this.project);
  }
}
