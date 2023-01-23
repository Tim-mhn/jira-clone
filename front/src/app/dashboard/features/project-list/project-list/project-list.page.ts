import { Component, OnInit } from '@angular/core';
import { RequestState } from '@tim-mhn/common/http';
import { ProjectController } from '../../../core/controllers/project.controller';
import { ProjectListService } from '../state-services/project-list.service';

@Component({
  selector: 'jira-project-list',
  templateUrl: './project-list.page.html',
})
export class ProjectListComponent implements OnInit {
  constructor(
    private controller: ProjectController,
    private projectListService: ProjectListService
  ) {}

  projectList$ = this.projectListService.projectList$;
  requestState = new RequestState();

  ngOnInit(): void {
    this.controller.getUserProjectsAndUpdateList(this.requestState).subscribe();
  }
}
