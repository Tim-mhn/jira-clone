import { Component, Input, OnInit } from '@angular/core';
import { RequestState } from '@tim-mhn/common/http';
import { ProjectController } from '../../../controllers/project.controller';
import { ProjectInfo } from '../../../models';

@Component({
  selector: 'jira-delete-project-button',
  templateUrl: './delete-project-button.component.html',
})
export class DeleteProjectButtonComponent implements OnInit {
  @Input() project: ProjectInfo;

  requestState = new RequestState();
  constructor(private controller: ProjectController) {}

  ngOnInit(): void {}

  deleteProject() {
    this.controller
      .deleteProjectAndUpdateList(this.project, this.requestState)
      .subscribe();
  }
}
