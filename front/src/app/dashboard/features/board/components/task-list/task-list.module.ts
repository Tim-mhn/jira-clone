import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { TimUIChipModule } from '@tim-mhn/ng-ui/chip';
import { TimInputModule } from '@tim-mhn/ng-forms/input';
import { ReactiveFormsModule } from '@angular/forms';
import { TimUIButtonModule } from '@tim-mhn/ng-ui/button';
import { TimUISpinnerModule } from '@tim-mhn/ng-ui/spinner';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TimUIDropdownMenuModule } from '@tim-mhn/ng-ui/dropdown-menu';
import { TimAutocompleteModule } from '@tim-mhn/ng-forms/autocomplete';
import { TaskListComponent } from './task-list.component';
import { MemberComponentsModule } from '../../../../../shared/components/member/member-components.module';
import { TaskListItemComponent } from './task-list-item/task-list-item.component';
import { TaskStatusComponentsModule } from '../../../../core/components/task-status/task-status.module';
import { TaskAssigneeModule } from '../../../../core/components/task-assignee/task-assignee.module';
import { TaskPointsChipModule } from '../../../../core/components/task-points-chip/task-points-chip.module';
import { TaskSideActionsModule } from '../../../../core/components/task-side-actions/task-side-actions.module';
import { TaskTypeModule } from '../../../../core/components/task-type/task-type.module';
import { SharedPipesModule } from '../../../../../shared/pipes/pipes.module';

@NgModule({
  declarations: [TaskListComponent, TaskListItemComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    MemberComponentsModule,
    TaskStatusComponentsModule,
    TaskAssigneeModule,
    TimUIChipModule,
    TimInputModule,
    ReactiveFormsModule,
    TimUIButtonModule,
    TimUISpinnerModule,
    TaskPointsChipModule,
    TaskSideActionsModule,
    DragDropModule,
    TaskTypeModule,
    TimUIDropdownMenuModule,
    TimAutocompleteModule,
    SharedPipesModule,
  ],
  exports: [TaskListComponent],
})
export class TaskListModule {}
