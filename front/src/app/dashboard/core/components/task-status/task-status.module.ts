import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { TaskStatusChipComponent } from './task-status-chip/task-status-chip.component';
import { TaskStatusSelectorComponent } from './task-status-selector/task-status-selector.component';
import { TaskStatusTriggerComponent } from './task-status-trigger/task-status-trigger.component';

@NgModule({
  declarations: [
    TaskStatusSelectorComponent,
    TaskStatusChipComponent,
    TaskStatusTriggerComponent,
  ],
  imports: [CommonModule, MatMenuModule],
  exports: [
    TaskStatusSelectorComponent,
    TaskStatusChipComponent,
    TaskStatusTriggerComponent,
  ],
})
export class TaskStatusComponentsModule {}
