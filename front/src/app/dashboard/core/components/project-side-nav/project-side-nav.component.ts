import { Component, OnInit } from '@angular/core';
import { CurrentProjectService } from '../../state-services/current-project.service';
import { RouteProjectIdService } from '../../state-services/route-project-id.service';

@Component({
  selector: 'jira-project-side-nav',
  templateUrl: './project-side-nav.component.html',
})
export class ProjectSideNavComponent implements OnInit {
  constructor(
    private currentProjectService: CurrentProjectService,
    private routeProjectIdService: RouteProjectIdService
  ) {}

  currentProject$ = this.currentProjectService.currentProject$;
  projectId$ = this.routeProjectIdService.projectId$;
  ngOnInit(): void {}
}
