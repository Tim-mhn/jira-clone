import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { SingleProjectAPI } from '../../../core/apis/single-project.api';
import { ProjectWithMembersAndTasks } from '../../../core/models/project';
import { CurrentProjectService } from '../../state-services/current-project.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private api: SingleProjectAPI,
    private currentProjectService: CurrentProjectService
  ) {}

  project: ProjectWithMembersAndTasks;

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((params) => params['projectId']),
        filter((projectId) => !!projectId),
        switchMap((projectId) => this.api.getProjectInfo(projectId))
      )
      .subscribe((projectInfo) => {
        this.currentProjectService.updateCurrentProject(projectInfo);
        this.project = projectInfo;
      });
  }
}
