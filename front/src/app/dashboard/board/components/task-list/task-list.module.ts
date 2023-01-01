import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { TaskListComponent } from './task-list.component';
import { MemberIconModule } from '../../../../shared/components/member-icon/member-icon.module';
import { TaskStatusComponentsModule } from '../../../core/components/task-status/task-status.module';

@NgModule({
  declarations: [TaskListComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    MemberIconModule,
    TaskStatusComponentsModule,
  ],
  exports: [TaskListComponent],
})
export class TaskListModule {}
