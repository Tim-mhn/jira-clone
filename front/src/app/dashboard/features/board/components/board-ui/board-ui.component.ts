import {
  Component,
  Input,
  OnInit,
  Output,
  TrackByFunction,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BoardFilters } from '../../../../core/models/board-filters';
import { Project } from '../../../../core/models/project';
import { ProjectMembers } from '../../../../core/models/project-member';
import { SprintInfo, SprintWithTasks } from '../../../../core/models';
import { Task } from '../../../../core/models/task';

@Component({
  selector: 'jira-board-ui',
  templateUrl: './board-ui.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardUiComponent implements OnInit {
  @Input() project: Project;
  @Input() projectMembers: ProjectMembers;
  @Input() sprintWithTasksList: SprintWithTasks[];
  @Input() sprintInfoList: SprintInfo[];

  @Output() filtersChange = new EventEmitter<BoardFilters>();

  taskSelected: Task;

  constructor() {}

  ngOnInit(): void {}

  trackBySprintId: TrackByFunction<SprintWithTasks> = (
    _index: number,
    s: SprintWithTasks
  ) => s.Sprint.Id;

  updateTaskSelected(task: Task) {
    this.taskSelected = task;
  }

  resetTaskSelected() {
    this.taskSelected = null;
  }
}
