import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { buildTaskPageRoute } from '../../../../core/utils/build-task-page-route.util';
import { TaskInfo } from '../../models/task-info';

@Component({
  selector: 'jira-tasks-search-item',
  templateUrl: './tasks-search-item.component.html',
  host: {
    class: 'overflow-hidden',
  },
})
export class TasksSearchItemComponent implements OnInit, OnChanges {
  @Input() taskInfo: TaskInfo;
  constructor() {}

  taskPageRoute: string[] = [];

  ngOnInit(): void {}

  ngOnChanges(_changes: SimpleChanges): void {
    this.taskPageRoute = buildTaskPageRoute(
      this.taskInfo,
      this.taskInfo.Project
    );
  }
}
