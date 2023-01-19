import { Component, OnInit } from '@angular/core';
import { CurrentProjectService } from '../../state-services/current-project.service';

@Component({
  selector: 'jira-project-side-nav',
  templateUrl: './project-side-nav.component.html',
})
export class ProjectSideNavComponent implements OnInit {
  constructor(private currentProjectService: CurrentProjectService) {}

  currentProject$ = this.currentProjectService.currentProject$;
  ngOnInit(): void {}
}
