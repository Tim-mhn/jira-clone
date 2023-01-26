import { Component, OnInit } from '@angular/core';
import { RequestState } from '@tim-mhn/common/http';
import { ProjectListController } from '../controllers/project-list.controller';
import { ProjectListService } from '../state-services/project-list.service';

@Component({
  selector: 'jira-project-list',
  templateUrl: './project-list.page.html',
  providers: [ProjectListController],
})
export class ProjectListComponent implements OnInit {
  constructor(
    private controller: ProjectListController,
    private projectListService: ProjectListService
  ) {}

  projectList$ = this.projectListService.projectList$;
  requestState = new RequestState();

  ngOnInit(): void {
    this.controller.getUserProjectsAndUpdateList(this.requestState).subscribe();
  }
}
