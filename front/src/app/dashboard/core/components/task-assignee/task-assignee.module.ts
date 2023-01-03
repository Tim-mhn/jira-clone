import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimUIDropdownMenuModule } from '@tim-mhn/ng-ui/dropdown-menu';
import { TaskAssigneeSelectorComponent } from './task-assignee-selector/task-assignee-selector.component';
import { MemberIconModule } from '../../../../shared/components/member-icon/member-icon.module';

@NgModule({
  declarations: [TaskAssigneeSelectorComponent],
  imports: [CommonModule, MemberIconModule, TimUIDropdownMenuModule],
  exports: [TaskAssigneeSelectorComponent],
})
export class TaskAssigneeModule {}
