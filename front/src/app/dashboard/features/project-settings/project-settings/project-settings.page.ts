import { Component, OnInit } from '@angular/core';
import { RequestState } from '@tim-mhn/common/http';
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

  requestState = new RequestState();
  members$ = this.projectService.currentProject$.pipe(
    switchMap(({ Id }) =>
      this.projectController.getProjectMembers(Id, this.requestState)
    )
  );

  ngOnInit(): void {
    this.requestState.toPending();
  }
}
