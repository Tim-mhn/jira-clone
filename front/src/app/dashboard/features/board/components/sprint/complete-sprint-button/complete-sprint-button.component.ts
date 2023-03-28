import { Component, Input, OnInit, Optional } from '@angular/core';
import { RequestState } from '@tim-mhn/common/http';
import { SprintController } from '../../../../../core/controllers/sprint.controller';
import { Sprint } from '../../../../../core/models';
import { BoardSprintController } from '../../../controllers/board-sprint.controller';

@Component({
  selector: 'jira-complete-sprint-button',
  templateUrl: './complete-sprint-button.component.html',
})
export class CompleteSprintButtonComponent implements OnInit {
  constructor(
    @Optional() private boardController: BoardSprintController,
    private sprintController: SprintController
  ) {}

  @Input() sprint: Sprint;

  requestState = new RequestState();
  ngOnInit(): void {}

  completeSprint(e: Event) {
    e?.stopPropagation();

    if (this.boardController) {
      this.boardController
        .completeSprintAndUpdateBoardList(this.sprint, this.requestState)
        .subscribe();
    } else {
      this.sprintController
        .completeSprintAndShowSnackbarWithUndoAction(
          this.sprint,
          this.requestState
        )
        .subscribe();
    }
  }
}
