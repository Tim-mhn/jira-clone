import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimDateModule } from '@tim-mhn/common/date';
import { ProjectMembersListComponent } from './project-members-list.component';
import { MemberComponentsModule } from '../../../../../shared/components/member/member-components.module';
import { TableModule } from '../../../../../shared/components/table/table.module';

@NgModule({
  declarations: [ProjectMembersListComponent],
  imports: [CommonModule, TimDateModule, MemberComponentsModule, TableModule],
  exports: [ProjectMembersListComponent],
})
export class ProjectMembersListModule {}
