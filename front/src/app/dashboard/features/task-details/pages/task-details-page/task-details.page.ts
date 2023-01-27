import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestState } from '@tim-mhn/common/http';
import { filter, map, shareReplay, switchMap } from 'rxjs';
import { GetTaskController } from '../../../../core/controllers/get-task.controller';
import { CurrentProjectService } from '../../../../core/state-services/current-project.service';
import { CurrentSprintsService } from '../../../board/state-services/current-sprints.service';
import { ProjectMembersService } from '../../../board/state-services/project-members.service';

@Component({
  selector: 'jira-task-details-page',
  templateUrl: './task-details.page.html',
})
export class TaskDetailsPage implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private controller: GetTaskController,
    private currentProjectService: CurrentProjectService,
    private projectMembersService: ProjectMembersService,
    private sprintsService: CurrentSprintsService
  ) {}

  members$ = this.projectMembersService.projectMembers$;
  requestState = new RequestState();
  project$ = this.currentProjectService.currentProject$;
  activeSprints$ = this.sprintsService.activeSprints$;

  task$ = this._buildTask$();
  ngOnInit(): void {}

  private _buildTask$() {
    return this.route.params.pipe(
      map((params) => params.taskId),
      filter((taskId) => {
        const hasTaskId = !!taskId;
        if (!hasTaskId) console.error('no taskId in route param');
        return hasTaskId;
      }),
      switchMap((taskId) => this.controller.getTask(taskId, this.requestState)),
      shareReplay()
    );
  }
}
