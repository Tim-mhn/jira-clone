import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs';
import { ProjectController } from '../../../core/controllers/project.controller';
import { CurrentProjectService } from '../../../core/state-services/current-project.service';

@Component({
  selector: 'jira-project-settings',
  templateUrl: './project-settings.page.html',
})
export class ProjectSettingsComponent implements OnInit {
  constructor(
    public projectService: CurrentProjectService,
    private projectController: ProjectController
  ) {}

  members$ = this.projectService.currentProject$.pipe(
    switchMap(({ Id }) => this.projectController.getProjectMembers(Id))
  );

  ngOnInit(): void {}
}
