import { Component, Inject, OnInit } from '@angular/core';
import { RequestState } from '@tim-mhn/common/http';
import { TimUIDialogRef, TIM_DIALOG_DATA } from '@tim-mhn/ng-ui/dialog';
import { BoardSprintController } from '../../../../features/board/controllers/board-sprint.controller';

export type DeleteSprintDialogInput = {
  sprintId: string;
  sprintName: string;
};
@Component({
  selector: 'jira-delete-sprint-dialog',
  templateUrl: './delete-sprint-dialog.component.html',
})
export class DeleteSprintDialogComponent implements OnInit {
  constructor(
    @Inject(TIM_DIALOG_DATA) public dialogInput: DeleteSprintDialogInput,
    private _dialogRef: TimUIDialogRef,
    private controller: BoardSprintController
  ) {}

  requestState = new RequestState();
  ngOnInit(): void {}

  confirmDeletion() {
    this.controller
      .deleteSprintAndUpdateBoardList(
        this.dialogInput.sprintId,
        this.requestState
      )
      .subscribe(() => this._dialogRef.close());
  }

  cancel() {
    this._dialogRef.close();
  }
}
