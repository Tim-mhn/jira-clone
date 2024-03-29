import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TimUISpinnerModule } from '@tim-mhn/ng-ui/spinner';
import { TimUIAlertModule } from '@tim-mhn/ng-ui/alert';
import { ProjectListUiComponent } from './project-list-ui.component';
import { CreateProjectModule } from '../create-project/create-project.module';
import { MemberComponentsModule } from '../../../../../shared/components/member/member-components.module';
import { DeleteProjectModule } from '../../../../core/components/delete-project/delete-project.module';

@NgModule({
  declarations: [ProjectListUiComponent],
  imports: [
    CommonModule,
    RouterModule,
    TimUISpinnerModule,
    TimUIAlertModule,
    CreateProjectModule,
    MemberComponentsModule,
    DeleteProjectModule,
  ],
  exports: [ProjectListUiComponent],
})
export class ProjectListUiModule {}
