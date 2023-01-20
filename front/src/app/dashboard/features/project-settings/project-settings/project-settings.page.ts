import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs';
import { ProjectMembersAPI } from '../../../core/apis/project-members.api';
import { CurrentProjectService } from '../../../core/state-services/current-project.service';

@Component({
  selector: 'jira-project-settings',
  templateUrl: './project-settings.page.html',
})
export class ProjectSettingsComponent implements OnInit {
  constructor(
    public projectService: CurrentProjectService,
    private membersAPI: ProjectMembersAPI
  ) {}

  members$ = this.projectService.currentProject$.pipe(
    switchMap(({ Id }) => this.membersAPI.getProjectMembers(Id))
  );

  ngOnInit(): void {}
}
