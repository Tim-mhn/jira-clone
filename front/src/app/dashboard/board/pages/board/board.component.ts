import { Component, OnDestroy, OnInit, TrackByFunction } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { filter, map, Observable, share, switchMap, takeUntil } from 'rxjs';
import { SubscriptionHandler } from '../../../../shared/services/subscription-handler.service';
import { GetSprintsController } from '../../../core/controllers/get-sprints.controller';
import { ProjectController } from '../../../core/controllers/project.controller';
import { SprintWithTasks } from '../../../core/models/sprint';
import { Task } from '../../../core/models/task';
import { CurrentProjectService } from '../../state-services/current-project.service';
import { CurrentSprintsService } from '../../state-services/current-sprints.service';

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
    private requestStateController: RequestStateController,
    public sprintsService: CurrentSprintsService,
    private sprintsController: GetSprintsController
  ) {}

  private _subscriptionHandler = new SubscriptionHandler();

  project$ = this.currentProjectService.currentProject$.pipe(share());
  taskSelected: Task;

  requestState = new RequestState();

  ngOnInit(): void {
    const projectId$ = this.route.params.pipe(
      map((params) => params['projectId']),
      filter((projectId) => !!projectId)
    );

    this._getSprintsOnRouteChange(projectId$);
    this._getProjectOnRouteChange(projectId$);
  }

  trackBySprintId: TrackByFunction<SprintWithTasks> = (
    _index: number,
    s: SprintWithTasks
  ) => s.Sprint.Id;

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
        },
      });
  }

  private _getSprintsOnRouteChange(projectId$: Observable<string>) {
    projectId$
      .pipe(
        switchMap((projectID) =>
          this.sprintsController.getSprintsTasksForProject(projectID)
        ),
        takeUntil(this._subscriptionHandler.onDestroy$)
      )
      .subscribe();
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
