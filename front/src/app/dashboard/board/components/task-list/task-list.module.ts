import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { TimUIChipModule } from '@tim-mhn/ng-ui/chip';
import { TaskListComponent } from './task-list.component';
import { MemberIconModule } from '../../../../shared/components/member-icon/member-icon.module';
import { TaskStatusComponentsModule } from '../../../core/components/task-status/task-status.module';
import { TaskAssigneeModule } from '../../../core/components/task-assignee/task-assignee.module';

@NgModule({
  declarations: [TaskListComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    MemberIconModule,
    TaskStatusComponentsModule,
    TaskAssigneeModule,
    TimUIChipModule,
  ],
  exports: [TaskListComponent],
})
export class TaskListModule {}
