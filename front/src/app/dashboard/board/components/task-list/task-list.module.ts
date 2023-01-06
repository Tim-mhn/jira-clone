import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { TimUIChipModule } from '@tim-mhn/ng-ui/chip';
import { TimInputModule } from '@tim-mhn/ng-forms/input';
import { ReactiveFormsModule } from '@angular/forms';
import { TimUIButtonModule } from '@tim-mhn/ng-ui/button';
import { TimUISpinnerModule } from '@tim-mhn/ng-ui/spinner';
import { TaskListComponent } from './task-list.component';
import { MemberIconModule } from '../../../../shared/components/member-icon/member-icon.module';
import { TaskStatusComponentsModule } from '../../../core/components/task-status/task-status.module';
import { TaskAssigneeModule } from '../../../core/components/task-assignee/task-assignee.module';
import { TaskListItemComponent } from './task-list-item/task-list-item.component';

@NgModule({
  declarations: [TaskListComponent, TaskListItemComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    MemberIconModule,
    TaskStatusComponentsModule,
    TaskAssigneeModule,
    TimUIChipModule,
    TimInputModule,
    ReactiveFormsModule,
    TimUIButtonModule,
    TimUISpinnerModule,
  ],
  exports: [TaskListComponent],
})
export class TaskListModule {}
