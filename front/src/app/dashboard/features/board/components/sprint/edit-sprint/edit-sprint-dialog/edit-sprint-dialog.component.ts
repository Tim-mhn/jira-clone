import { Component, Inject, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { RequestState } from '@tim-mhn/common/http';
import { TypedFormBuilder } from '@tim-mhn/common/typed-forms';
import { DateRange } from '@tim-mhn/ng-forms/date-range-picker';
import { TimUIDialogRef, TIM_DIALOG_DATA } from '@tim-mhn/ng-ui/dialog';
import { SprintController } from '../../../../../../core/controllers/sprint.controller';
import { Sprint, UpdateSprint } from '../../../../../../core/models';

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

  editSprintForm = this.tfb.group({
    name: this.tfb.control(this.sprint.Name, [
      Validators.required,
      Validators.minLength(1),
    ]),
    dateRange: this.tfb.control<DateRange>(this.initialDateRange),
  });

  private get initialDateRange(): DateRange {
    const { StartDate, EndDate } = this.sprint;
    if (!StartDate || !EndDate) return null;
    return {
      start: StartDate,
      end: EndDate,
    };
  }

  requestState = new RequestState();

  private get sprintNameControl() {
    return this.editSprintForm.controls.name;
  }

  private get updateSprintValue(): UpdateSprint {
    const { dateRange, name } = this.editSprintForm.value;

    return {
      name,
      startDate: dateRange?.start,
      endDate: dateRange?.end,
    };
  }
  updateSprint() {
    if (this.sprintNameControl.invalid) return;
    this.controller
      .updateSprintAndUpdateState(
        this.sprint,
        this.updateSprintValue,
        this.requestState
      )
      .subscribe(() => this.dialogRef.close());
  }

  ngOnInit(): void {}
}
