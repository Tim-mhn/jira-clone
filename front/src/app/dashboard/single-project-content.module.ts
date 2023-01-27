import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SingleProjectPagesLayoutComponent } from './core/components/single-project-pages-layout/single-project-pages-layout.component';
import { SingleProjectPagesLayoutModule } from './core/components/single-project-pages-layout/single-project-pages-layout.module';

const routes: Routes = [
  {
    path: ':projectId',
    component: SingleProjectPagesLayoutComponent,
    children: [
      {
        path: 'settings',
        loadChildren: () =>
          import(
            './features/project-settings/project-settings/project-settings.module'
          ).then((m) => m.ProjectSettingsModule),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'board',
      },
      {
        path: 'board',
        loadChildren: () =>
          import('./features/board/pages/board/board.module').then(
            (m) => m.BoardModule
          ),
      },
      {
        path: 'browse/:taskId',
        loadChildren: () =>
          import(
            './features/task-details/pages/task-details-page/task-details-page.module'
          ).then((m) => m.TaskDetailsPageModule),
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SingleProjectPagesLayoutModule,
  ],
})
export class SingleProjectContentModule {}
