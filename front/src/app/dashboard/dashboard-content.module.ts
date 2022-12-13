import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/project-list/project-list.module').then(
        (m) => m.ProjectListModule
      ),
  },
  {
    path: ':projectId',
    redirectTo: ':projectId/board',
  },
  {
    path: ':projectId/board',
    loadChildren: () =>
      import('./pages/board/board.module').then((m) => m.BoardModule),
  },
];
@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class DashboardContentModule {}
