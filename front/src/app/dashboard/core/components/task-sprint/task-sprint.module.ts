import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimUIChipModule } from '@tim-mhn/ng-ui/chip';
import { TimUIDropdownMenuModule } from '@tim-mhn/ng-ui/dropdown-menu';
import { TaskSprintSelectorComponent } from './task-sprint-selector/task-sprint-selector.component';
import { SprintTagComponent } from './sprint-tag/sprint-tag.component';
import { MoveTasksToSprintMenuItemsComponent } from './move-tasks-to-sprint-menu/move-tasks-to-sprint-menu.component';

@NgModule({
  declarations: [
    TaskSprintSelectorComponent,
    SprintTagComponent,
    MoveTasksToSprintMenuItemsComponent,
  ],
  imports: [CommonModule, TimUIChipModule, TimUIDropdownMenuModule],
  exports: [TaskSprintSelectorComponent, MoveTasksToSprintMenuItemsComponent],
})
export class TaskSprintModule {}
