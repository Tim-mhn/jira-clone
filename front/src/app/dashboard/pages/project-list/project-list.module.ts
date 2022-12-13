import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProjectListComponent } from './project-list.component';
import { ProjectListAPI } from '../../apis/project-list.api';

const routes: Routes = [
  {
    path: '',
    component: ProjectListComponent,
  },
];
@NgModule({
  declarations: [ProjectListComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  providers: [ProjectListAPI],
})
export class ProjectListModule {}
