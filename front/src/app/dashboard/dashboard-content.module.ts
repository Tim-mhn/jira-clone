import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('./features/project-list/project-list/project-list.module').then(
        (m) => m.ProjectListModule
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./single-project-content.module').then(
        (m) => m.SingleProjectContentModule
      ),
  },
];
@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class DashboardContentModule {}
