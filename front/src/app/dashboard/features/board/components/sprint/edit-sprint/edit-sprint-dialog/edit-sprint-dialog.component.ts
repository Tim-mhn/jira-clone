import { Component, Inject, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { RequestState } from '@tim-mhn/common/http';
import { TypedFormBuilder } from '@tim-mhn/common/typed-forms';
import { TimUIDialogRef, TIM_DIALOG_DATA } from '@tim-mhn/ng-ui/dialog';
import { SprintController } from '../../../../../../core/controllers/sprint.controller';
import { Sprint } from '../../../../../../core/models';

export type EditSprintDialogInput = Sprint;
@Component({
  selector: 'jira-edit-sprint-dialog',
  templateUrl: './edit-sprint-dialog.component.html',
})
export class EditSprintDialogComponent implements OnInit {
  constructor(
    @Inject(TIM_DIALOG_DATA) public sprint: EditSprintDialogInput,
    private tfb: TypedFormBuilder,
    private dialogRef: TimUIDialogRef,
    private controller: SprintController
  ) {}

  sprintNameControl = this.tfb.control(this.sprint.Name, [
    Validators.required,
    Validators.minLength(1),
  ]);

  requestState = new RequestState();

  updateSprintName() {
    if (this.sprintNameControl.invalid) return;
    this.controller
      .updateSprintAndUpdateState(
        this.sprint,
        this.sprintNameControl.value,
        this.requestState
      )
      .subscribe(() => this.dialogRef.close());
  }

  ngOnInit(): void {}
}
