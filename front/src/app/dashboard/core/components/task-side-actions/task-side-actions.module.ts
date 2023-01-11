import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimUIButtonModule } from '@tim-mhn/ng-ui/button';
import { TimUIDropdownMenuModule } from '@tim-mhn/ng-ui/dropdown-menu';
import { TaskSideActionsComponent } from './task-side-actions.component';

@NgModule({
  declarations: [TaskSideActionsComponent],
  imports: [CommonModule, TimUIButtonModule, TimUIDropdownMenuModule],
  exports: [TaskSideActionsComponent],
})
export class TaskSideActionsModule {}
