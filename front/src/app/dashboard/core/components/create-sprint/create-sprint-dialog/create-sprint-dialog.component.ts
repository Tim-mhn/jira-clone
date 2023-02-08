import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { RequestState } from '@tim-mhn/common/http';
import { TypedFormBuilder } from '@tim-mhn/common/typed-forms';
import { TimUIDialogRef } from '@tim-mhn/ng-ui/dialog';
import { BoardSprintController } from '../../../../features/board/controllers/board-sprint.controller';

@Component({
  selector: 'jira-create-sprint-dialog',
  templateUrl: './create-sprint-dialog.component.html',
})
export class CreateSprintDialogComponent implements OnInit {
  constructor(
    private controller: BoardSprintController,
    private tfb: TypedFormBuilder,
    private dialogRef: TimUIDialogRef
  ) {}

  ngOnInit(): void {}

  requestState = new RequestState();

  sprintNameControl = this.tfb.control('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  createSprint() {
    if (!this.sprintNameControl.valid) {
      console.error('form invalid');
      console.error(this.sprintNameControl.errors);
    }
    const sprintName = this.sprintNameControl.value;
    this.controller
      .createSprintAndUpdateBoardList(sprintName, this.requestState)
      .subscribe(() => this.dialogRef.close());
  }
}
