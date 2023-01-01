import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { TaskListComponent } from './task-list.component';
import { MemberIconModule } from '../../../../shared/components/member-icon/member-icon.module';
import { TaskStatusTriggerModule } from '../../../core/components/task-status-trigger/task-status-trigger.module';
import { TaskStatusChipModule } from '../../../core/components/task-status-chip/task-status-chip.module';

@NgModule({
  declarations: [TaskListComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    MemberIconModule,
    TaskStatusTriggerModule,
    TaskStatusChipModule,
  ],
  exports: [TaskListComponent],
})
export class TaskListModule {}
