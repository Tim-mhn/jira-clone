import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimUIButtonModule } from '@tim-mhn/ng-ui/button';
import { TimUIDropdownMenuModule } from '@tim-mhn/ng-ui/dropdown-menu';
import { TimUIDividerModule } from '@tim-mhn/ng-ui/divider';
import { TaskSideActionsComponent } from './task-side-actions.component';
import { TaskSprintModule } from '../task-sprint/task-sprint.module';

@NgModule({
  declarations: [TaskSideActionsComponent],
  imports: [
    CommonModule,
    TimUIButtonModule,
    TimUIDropdownMenuModule,
    TimUIDividerModule,
    TaskSprintModule,
  ],
  exports: [TaskSideActionsComponent],
})
export class TaskSideActionsModule {}
