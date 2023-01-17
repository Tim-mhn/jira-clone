import { Component, OnDestroy, OnInit, TrackByFunction } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import {
  combineLatest,
  filter,
  map,
  Observable,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { SubscriptionHandler } from '../../../../shared/services/subscription-handler.service';
import { GetSprintsController } from '../../../core/controllers/get-sprints.controller';
import { ProjectController } from '../../../core/controllers/project.controller';
import { BoardFilters } from '../../../core/models/board-filters';
import { SprintWithTasks } from '../../../core/models/sprint';
import { CurrentProjectService } from '../../state-services/current-project.service';
import { CurrentSprintsService } from '../../state-services/current-sprints.service';
import { ProjectMembersService } from '../../state-services/project-members.service';

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
    private sprintsController: GetSprintsController,
    private membersService: ProjectMembersService
  ) {}

  private _subscriptionHandler = new SubscriptionHandler();

  requestState = new RequestState();

  private _filtersChange = new Subject<BoardFilters>();

  project$ = this.currentProjectService.currentProject$.pipe(shareReplay());
  projectMembers$ = this.membersService.projectMembers$;
  sprintInfoList$ = this.sprintsService.sprintInfoList$;

  ngOnInit(): void {
    const projectId$ = this.route.params.pipe(
      map((params) => params['projectId']),
      filter((projectId) => !!projectId)
    );

    this._getSprintsOnRouteOrFiltersChange(projectId$);
    this._getProjectOnRouteChange(projectId$);
  }

  trackBySprintId: TrackByFunction<SprintWithTasks> = (
    _index: number,
    s: SprintWithTasks
  ) => s.Sprint.Id;

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

  onFiltersChange(newFilters: BoardFilters) {
    this._filtersChange.next(newFilters);
  }

  private _getSprintsOnRouteOrFiltersChange(projectId$: Observable<string>) {
    const filters$ = this._filtersChange.pipe(startWith(null));

    combineLatest({ projectId: projectId$, filters: filters$ })
      .pipe(
        switchMap(({ projectId, filters }) =>
          this.sprintsController.getSprintsTasksForProject(projectId, filters)
        ),
        takeUntil(this._subscriptionHandler.onDestroy$)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this._subscriptionHandler.destroy();
  }
}
