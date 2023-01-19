import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteProjectIdService } from '../../state-services/route-project-id.service';

@Component({
  selector: 'jira-single-project-pages-layout',
  templateUrl: './single-project-pages-layout.component.html',
})
export class SingleProjectPagesLayoutComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private routeProjectIdService: RouteProjectIdService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const projectId = params.get('projectId');
      if (!projectId) return;
      this.routeProjectIdService.setProjectId(projectId);
    });
  }
}
