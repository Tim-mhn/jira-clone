import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TimUISpinnerModule } from '@tim-mhn/ng-ui/spinner';
import { TimUIAlertModule } from '@tim-mhn/ng-ui/alert';
import { ProjectListUiComponent } from './project-list-ui.component';

@NgModule({
  declarations: [ProjectListUiComponent],
  imports: [CommonModule, RouterModule, TimUISpinnerModule, TimUIAlertModule],
  exports: [ProjectListUiComponent],
})
export class ProjectListUiModule {}
