import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskDetailsComponent } from './task-details.component';
import { TaskAssigneeModule } from '../../../core/components/task-assignee/task-assignee.module';
import { TaskStatusComponentsModule } from '../../../core/components/task-status/task-status.module';

@NgModule({
  declarations: [TaskDetailsComponent],
  imports: [CommonModule, TaskAssigneeModule, TaskStatusComponentsModule],
  exports: [TaskDetailsComponent],
})
export class TaskDetailsModule {}
