import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimUITooltipModule } from '@tim-mhn/ng-ui/tooltip';
import { TimUIChipModule } from '@tim-mhn/ng-ui/chip';
import { TimUIDropdownMenuModule } from '@tim-mhn/ng-ui/dropdown-menu';
import { TaskTypeTagComponent } from './task-type-tag/task-type-tag.component';
import { TaskTypeSelectorComponent } from './task-type-selector/task-type-selector.component';

@NgModule({
  declarations: [TaskTypeTagComponent, TaskTypeSelectorComponent],
  imports: [
    CommonModule,
    TimUIChipModule,
    TimUIDropdownMenuModule,
    TimUITooltipModule,
  ],
  exports: [TaskTypeTagComponent, TaskTypeSelectorComponent],
})
export class TaskTypeModule {}
