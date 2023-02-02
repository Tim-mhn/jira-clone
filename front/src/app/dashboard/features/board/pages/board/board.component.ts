import { Component, OnDestroy, OnInit, TrackByFunction } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { Observable, shareReplay, Subject, switchMap } from 'rxjs';
import { SubscriptionHandler } from '../../../../../shared/services/subscription-handler.service';
import { BoardFilters } from '../../../../core/models/board-filters';
import { SprintWithTasks } from '../../../../core/models';
import { RouteProjectIdService } from '../../../../core/state-services/route-project-id.service';
import { CurrentProjectService } from '../../../../core/state-services/current-project.service';
import { CurrentSprintsService } from '../../state-services/current-sprints.service';
import { ProjectMembersService } from '../../state-services/project-members.service';
import { GetTasksOfBoardController } from '../../controllers/get-board-tasks.controller';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  providers: [RequestStateController],
})
export class BoardComponent implements OnInit, OnDestroy {
  constructor(
    private currentProjectService: CurrentProjectService,
    public sprintsService: CurrentSprintsService,
    private membersService: ProjectMembersService,
    private routeProjectIdService: RouteProjectIdService,
    private boardTasksController: GetTasksOfBoardController
  ) {}

  private _subscriptionHandler = new SubscriptionHandler();

  requestState = new RequestState();

  private _filtersChange = new Subject<BoardFilters>();

  project$ = this.currentProjectService.currentProject$.pipe(shareReplay());
  projectMembers$ = this.membersService.projectMembers$;
  activeSprints$ = this.sprintsService.activeSprints$;

  ngOnInit(): void {
    // eslint-disable-next-line prefer-destructuring
    const projectId$ = this.routeProjectIdService.projectId$;
    this._getSprintsWithAllTestsOnProjectChange(projectId$);
    this._filterSprintsOnFiltersChange();
  }

  trackBySprintId: TrackByFunction<SprintWithTasks> = (
    _index: number,
    s: SprintWithTasks
  ) => s.Sprint.Id;

  onFiltersChange(newFilters: BoardFilters) {
    this._filtersChange.next(newFilters);
  }

  private _getSprintsWithAllTestsOnProjectChange(
    projectId$: Observable<string>
  ) {
    projectId$
      .pipe(
        switchMap((projectId) =>
          this.boardTasksController.getSprintsTasksForProject(
            projectId,
            this.requestState
          )
        )
      )
      .subscribe();
  }

  private _filterSprintsOnFiltersChange() {
    this._filtersChange
      .pipe(
        switchMap((filters) =>
          this.boardTasksController.filterSprintTasksAndUpdateState(filters)
        )
      )
      .subscribe();
  }

  ngOnDestroy() {
    this._subscriptionHandler.destroy();
  }
}
