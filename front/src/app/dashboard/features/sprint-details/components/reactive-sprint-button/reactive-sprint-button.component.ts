import { Component, Input, OnInit } from '@angular/core';
import { RequestState } from '@tim-mhn/common/http';
import { SprintController } from '../../../../core/controllers/sprint.controller';
import { Sprint } from '../../../../core/models';

@Component({
  selector: 'jira-reactive-sprint-button',
  templateUrl: './reactive-sprint-button.component.html',
})
export class ReactiveSprintButtonComponent implements OnInit {
  @Input() sprint: Sprint;
  constructor(private controller: SprintController) {}

  requestState = new RequestState();
  ngOnInit(): void {}

  reactiveSprint() {
    this.controller
      .reactiveSprintAndUpdateState(this.sprint, this.requestState)
      .subscribe();
  }
}
