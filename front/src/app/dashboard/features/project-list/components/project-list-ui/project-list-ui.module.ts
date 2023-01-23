import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TimUISpinnerModule } from '@tim-mhn/ng-ui/spinner';
import { TimUIAlertModule } from '@tim-mhn/ng-ui/alert';
import { ProjectListUiComponent } from './project-list-ui.component';
import { CreateProjectModule } from '../create-project/create-project.module';
import { BoardContentProvidersModule } from '../../../board/board-providers.module';

@NgModule({
  declarations: [ProjectListUiComponent],
  imports: [
    CommonModule,
    RouterModule,
    TimUISpinnerModule,
    TimUIAlertModule,
    CreateProjectModule,
    BoardContentProvidersModule,
  ],
  exports: [ProjectListUiComponent],
})
export class ProjectListUiModule {}
