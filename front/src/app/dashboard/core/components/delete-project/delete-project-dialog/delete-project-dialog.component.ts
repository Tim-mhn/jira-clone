import { Component, Inject, OnInit } from '@angular/core';
import { TimUIDialogRef, TIM_DIALOG_DATA } from '@tim-mhn/ng-ui/dialog';
import { ProjectInfo } from '../../../models';

export type DeleteProjectDialogInput = ProjectInfo;
export type DeleteProjectDialogOutput = {
  delete: boolean;
};
@Component({
  selector: 'jira-delete-project-dialog',
  templateUrl: './delete-project-dialog.component.html',
})
export class DeleteProjectDialogComponent implements OnInit {
  constructor(
    @Inject(TIM_DIALOG_DATA) public dialogData: DeleteProjectDialogInput,
    private _dialogRef: TimUIDialogRef<DeleteProjectDialogOutput>
  ) {}

  ngOnInit(): void {}

  confirmDeletion() {
    this._dialogRef.close({ delete: true });
  }
}
