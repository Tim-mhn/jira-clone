import { Component, OnInit } from '@angular/core';
import { RequestState } from '@tim-mhn/common/http';
import { ProjectController } from '../../../core/controllers/project.controller';
import { ProjectInfoList } from '../../../core/models/project';

@Component({
  selector: 'jira-project-list',
  templateUrl: './project-list.page.html',
})
export class ProjectListComponent implements OnInit {
  constructor(private controller: ProjectController) {}

  projectList: ProjectInfoList = [];
  requestState = new RequestState();

  ngOnInit(): void {
    this.controller
      .getUserProjects(this.requestState)
      .subscribe((projects) => (this.projectList = projects));
  }
}
