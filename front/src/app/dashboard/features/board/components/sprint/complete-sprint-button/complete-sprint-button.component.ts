import { Component, Input, OnInit } from '@angular/core';
import { RequestState } from '@tim-mhn/common/http';
import { SprintController } from '../../../../../core/controllers/sprint.controller';

@Component({
  selector: 'jira-complete-sprint-button',
  templateUrl: './complete-sprint-button.component.html',
})
export class CompleteSprintButtonComponent implements OnInit {
  constructor(private controller: SprintController) {}

  @Input() sprintId: string;

  requestState = new RequestState();
  ngOnInit(): void {}

  completeSprint(e: Event) {
    e?.stopPropagation();
    this.controller
      .completeSprint(this.sprintId, this.requestState)
      .subscribe();
  }
}
