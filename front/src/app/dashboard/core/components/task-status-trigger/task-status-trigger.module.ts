import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskStatusTriggerComponent } from './task-status-trigger.component';
import { TaskStatusChipModule } from '../task-status-chip/task-status-chip.module';

@NgModule({
  declarations: [TaskStatusTriggerComponent],
  imports: [CommonModule, TaskStatusChipModule],
  exports: [TaskStatusTriggerComponent],
})
export class TaskStatusTriggerModule {}
