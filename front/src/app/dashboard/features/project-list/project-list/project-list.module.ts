import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProjectListComponent } from './project-list.page';
import { ProjectListUiModule } from '../project-list-ui/project-list-ui.module';
import { ProjectListAPI } from '../../../core/apis/project-list.api';
import { DashboardCoreProvidersModule } from '../../../core/core-apis-providers.module';

const routes: Routes = [
  {
    path: '',
    component: ProjectListComponent,
  },
];
@NgModule({
  declarations: [ProjectListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ProjectListUiModule,
    DashboardCoreProvidersModule,
  ],
  providers: [ProjectListAPI],
})
export class ProjectListModule {}
