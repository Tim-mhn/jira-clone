import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('./project-list/pages/project-list/project-list.module').then(
        (m) => m.ProjectListModule
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./board/board-content.module').then((m) => m.BoardContentModule),
  },
];
@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class DashboardContentModule {}
