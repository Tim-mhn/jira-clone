import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, Observable, switchMap, takeUntil, tap } from 'rxjs';
import { SubscriptionHandler } from '../../../../shared/services/subscription-handler.service';
import { GetSprintsController } from '../../controllers/get-sprints.controller';
import { ProjectController } from '../../controllers/project.controller';
import { ProjectId } from '../../models';
import { CurrentProjectService } from '../../state-services/current-project.service';
import { RouteProjectIdService } from '../../state-services/route-project-id.service';

@Component({
  selector: 'jira-single-project-pages-layout',
  templateUrl: './single-project-pages-layout.component.html',
})
export class SingleProjectPagesLayoutComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private routeProjectIdService: RouteProjectIdService,
    private controller: ProjectController,
    private currentProjectService: CurrentProjectService,
    private sprintsController: GetSprintsController
  ) {}

  private _subscriptionHandler = new SubscriptionHandler();

  ngOnInit(): void {
    this._getProjectAndUpdateState(this.projectIdRouteParam$);
    this._getActiveSprintsAndUpdateState(this.projectIdRouteParam$);
  }

  private _getProjectAndUpdateState(projectId$: Observable<ProjectId>) {
    projectId$
      .pipe(
        tap((projectId) => this.routeProjectIdService.setProjectId(projectId)),
        switchMap((projectId) => this.controller.getProject(projectId)),
        tap((project) =>
          this.currentProjectService.updateCurrentProject(project)
        )
      )
      .subscribe();
  }

  private _getActiveSprintsAndUpdateState(projectId$: Observable<ProjectId>) {
    projectId$
      .pipe(
        switchMap((projectId) =>
          this.sprintsController.getActiveSprintsOfProjectAndUpdateState(
            projectId
          )
        ),
        takeUntil(this._subscriptionHandler.onDestroy$)
      )
      .subscribe();
  }

  private get projectIdRouteParam$() {
    return this.route.paramMap.pipe(
      map((params) => params.get('projectId')),
      filter((projectId) => !!projectId)
    );
  }

  ngOnDestroy() {
    this._subscriptionHandler.destroy();
  }
}
