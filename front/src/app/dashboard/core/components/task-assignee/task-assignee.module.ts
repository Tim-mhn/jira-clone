import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimUIDropdownMenuModule } from '@tim-mhn/ng-ui/dropdown-menu';
import { TaskAssigneeSelectorComponent } from './task-assignee-selector/task-assignee-selector.component';
import { MemberComponentsModule } from '../../../../shared/components/member/member-components.module';

@NgModule({
  declarations: [TaskAssigneeSelectorComponent],
  imports: [CommonModule, MemberComponentsModule, TimUIDropdownMenuModule],
  exports: [TaskAssigneeSelectorComponent],
})
export class TaskAssigneeModule {}
