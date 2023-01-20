import { Component, OnDestroy, OnInit, TrackByFunction } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import {
  combineLatest,
  Observable,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { SubscriptionHandler } from '../../../../../shared/services/subscription-handler.service';
import { GetSprintsController } from '../../../../core/controllers/get-sprints.controller';
import { BoardFilters } from '../../../../core/models/board-filters';
import { SprintWithTasks } from '../../../../core/models/sprint';
import { RouteProjectIdService } from '../../../../core/state-services/route-project-id.service';
import { CurrentProjectService } from '../../../../core/state-services/current-project.service';
import { CurrentSprintsService } from '../../state-services/current-sprints.service';
import { ProjectMembersService } from '../../state-services/project-members.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  providers: [RequestStateController],
})
export class BoardComponent implements OnInit, OnDestroy {
  constructor(
    private currentProjectService: CurrentProjectService,
    public sprintsService: CurrentSprintsService,
    private sprintsController: GetSprintsController,
    private membersService: ProjectMembersService,
    private routeProjectIdService: RouteProjectIdService
  ) {}

  private _subscriptionHandler = new SubscriptionHandler();

  requestState = new RequestState();

  private _filtersChange = new Subject<BoardFilters>();

  project$ = this.currentProjectService.currentProject$.pipe(shareReplay());
  projectMembers$ = this.membersService.projectMembers$;
  sprintInfoList$ = this.sprintsService.sprintInfoList$;

  ngOnInit(): void {
    // eslint-disable-next-line prefer-destructuring
    const projectId$ = this.routeProjectIdService.projectId$;

    this._getSprintsOnRouteOrFiltersChange(projectId$);
  }

  trackBySprintId: TrackByFunction<SprintWithTasks> = (
    _index: number,
    s: SprintWithTasks
  ) => s.Sprint.Id;

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
