import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { filter, map, Observable, switchMap, takeUntil } from 'rxjs';
import { SubscriptionHandler } from '../../../../shared/services/subscription-handler.service';
import { ProjectController } from '../../../core/controllers/project.controller';
import { Project } from '../../../core/models/project';
import { Task } from '../../../core/models/task';
import { TaskStatus } from '../../../core/models/task-status';
import { CurrentProjectService } from '../../state-services/current-project.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  providers: [RequestStateController],
})
export class BoardComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private controller: ProjectController,
    private currentProjectService: CurrentProjectService,
    private requestStateController: RequestStateController
  ) {}

  private _subscriptionHandler = new SubscriptionHandler();

  project: Project;
  statusList: TaskStatus[] = [];

  projectId$: Observable<string>;

  taskSelected: Task;

  requestState = new RequestState();

  ngOnInit(): void {
    const projectId$ = this.route.params.pipe(
      map((params) => params['projectId']),
      filter((projectId) => !!projectId)
    );

    this._getProjectOnRouteChange(projectId$);
  }

  // todo: refine this logic to have separate controllers to get project id/name (and members ??) AND get tasks grouped by sprints
  private _getProjectOnRouteChange(projectId$: Observable<string>) {
    projectId$
      .pipe(
        switchMap((projectId) =>
          this.controller
            .getProject(projectId)
            .pipe(this.requestStateController.handleRequest(this.requestState))
        ),
        takeUntil(this._subscriptionHandler.onDestroy$)
      )
      .subscribe({
        next: (projectInfo) => {
          this.currentProjectService.updateCurrentProject(projectInfo);
          this.project = projectInfo;
          this.statusList = this.project.AllTaskStatus;
        },
      });
  }

  updateTaskSelected(task: Task) {
    this.taskSelected = task;
  }

  resetTaskSelected() {
    this.taskSelected = null;
  }

  ngOnDestroy() {
    this._subscriptionHandler.destroy();
  }
}
