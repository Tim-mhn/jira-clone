import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProjectListComponent } from './project-list.page';
import { ProjectListUiModule } from '../components/project-list-ui/project-list-ui.module';
import { ProjectListAPI } from '../../../core/apis/project-list.api';
import { ProjectListProvidersModule } from '../project-list-providers.module';

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
    ProjectListProvidersModule,
  ],
  providers: [ProjectListAPI],
})
export class ProjectListModule {}
