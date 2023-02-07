import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimDateModule } from '@tim-mhn/common/date';
import { TimInputModule } from '@tim-mhn/ng-forms/input';
import { ReactiveFormsModule } from '@angular/forms';
import { ProjectMembersListComponent } from './project-members-list.component';
import { MemberComponentsModule } from '../../../../../shared/components/member/member-components.module';
import { TableModule } from '../../../../../shared/components/table/table.module';

@NgModule({
  declarations: [ProjectMembersListComponent],
  imports: [
    CommonModule,
    TimDateModule,
    MemberComponentsModule,
    TableModule,
    TimInputModule,
    ReactiveFormsModule,
  ],
  exports: [ProjectMembersListComponent],
})
export class ProjectMembersListModule {}
