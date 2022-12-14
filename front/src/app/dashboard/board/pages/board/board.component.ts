import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, Observable, switchMap, takeUntil } from 'rxjs';
import { SubscriptionHandler } from '../../../../shared/services/subscription-handler.service';
import { SingleProjectAPI } from '../../../core/apis/single-project.api';
import { TaskStatusAPI } from '../../../core/apis/task-status.api';
import { ProjectInfo } from '../../../core/models/project';
import { TaskStatus } from '../../../core/models/task-status';
import { CurrentProjectService } from '../../state-services/current-project.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private api: SingleProjectAPI,
    private currentProjectService: CurrentProjectService,
    private taskStatusAPI: TaskStatusAPI
  ) {}

  private _subscriptionHandler = new SubscriptionHandler();

  project: ProjectInfo;
  statusList: TaskStatus[] = [];

  projectId$: Observable<string>;

  ngOnInit(): void {
    const projectId$ = this.route.params.pipe(
      map((params) => params['projectId']),
      filter((projectId) => !!projectId)
    );

    this._getProjectInfoOnRouteChange(projectId$);
    this._getAllTaskStatusOnRouteChange(projectId$);
  }

  private _getProjectInfoOnRouteChange(projectId$: Observable<string>) {
    projectId$
      .pipe(
        switchMap((projectId) => this.api.getProjectInfo(projectId)),
        takeUntil(this._subscriptionHandler.onDestroy$)
      )
      .subscribe({
        next: (projectInfo) => {
          this.currentProjectService.updateCurrentProject(projectInfo);
          this.project = projectInfo;
        },
      });
  }

  private _getAllTaskStatusOnRouteChange(projectId$: Observable<string>) {
    projectId$
      .pipe(
        switchMap((projectId) =>
          this.taskStatusAPI.getAllTaskStatus(projectId)
        ),
        takeUntil(this._subscriptionHandler.onDestroy$)
      )
      .subscribe((taskStatusList) => (this.statusList = taskStatusList));
  }

  ngOnDestroy() {
    this._subscriptionHandler.destroy();
  }
}
