import { Component, Inject, OnInit } from '@angular/core';
import { RequestState } from '@tim-mhn/common/http';
import { TimUIDialogRef, TIM_DIALOG_DATA } from '@tim-mhn/ng-ui/dialog';
import { SprintController } from '../../../controllers/sprint.controller';

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
    private controller: SprintController
  ) {}

  requestState = new RequestState();
  ngOnInit(): void {}

  confirmDeletion() {
    this.controller
      .deleteSprint(this.dialogInput.sprintId, this.requestState)
      .subscribe(() => this._dialogRef.close());
  }

  cancel() {
    this._dialogRef.close();
  }
}
