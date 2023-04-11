import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { SprintController } from '../../core/controllers/sprint.controller';
import { CurrentProjectService } from '../../core/state-services/current-project.service';

@Component({
  selector: 'jira-sprint',
  templateUrl: './sprint-details.page.html',
})
export class SprintPage implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private _currentProjectService: CurrentProjectService,
    private controller: SprintController
  ) {}

  sprint$ = this.route.params.pipe(
    map((params) => params.sprintId),
    switchMap((sprintId) => this.controller.getSprint(sprintId))
  );

  project$ = this._currentProjectService.currentProject$;

  ngOnInit(): void {}
}
