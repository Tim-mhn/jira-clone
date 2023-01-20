import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, Observable, switchMap, takeUntil, tap } from 'rxjs';
import { SubscriptionHandler } from '../../../../shared/services/subscription-handler.service';
import { ProjectController } from '../../controllers/project.controller';
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
    private currentProjectService: CurrentProjectService
  ) {}

  private _subscriptionHandler = new SubscriptionHandler();

  ngOnInit(): void {
    this.projectIdRouteParam$
      .pipe(
        tap((projectId) => this.routeProjectIdService.setProjectId(projectId)),
        this._getProjectAndUpdateState.bind(this),
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

  private _getProjectAndUpdateState(projectId$: Observable<string>) {
    return projectId$.pipe(
      switchMap((projectId) => this.controller.getProject(projectId)),
      tap((project) => this.currentProjectService.updateCurrentProject(project))
    );
  }
  ngOnDestroy() {
    this._subscriptionHandler.destroy();
  }
}
