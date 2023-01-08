import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimEditableChipModule } from '@tim-mhn/ng-forms/editable-chip';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskPointsChipComponent } from './task-points-chip.component';

@NgModule({
  declarations: [TaskPointsChipComponent],
  imports: [CommonModule, TimEditableChipModule, ReactiveFormsModule],
  exports: [TaskPointsChipComponent],
})
export class TaskPointsChipModule {}
