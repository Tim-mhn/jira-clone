import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SingleProjectPagesLayoutComponent } from '../core/components/single-project-pages-layout/single-project-pages-layout.component';
import { SingleProjectPagesLayoutModule } from '../core/components/single-project-pages-layout/single-project-pages-layout.module';
import { DashboardCoreProvidersModule } from '../core/core-apis-providers.module';
import { RouteProjectIdService } from '../core/state-services/route-project-id.service';
import { BoardContentProvidersModule } from './board-providers.module';

const routes: Routes = [
  {
    path: ':projectId',
    component: SingleProjectPagesLayoutComponent,
    children: [
      {
        path: 'settings',
        loadChildren: () =>
          import(
            '../projects/pages/project-settings/project-settings.module'
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
          import('./pages/board/board.module').then((m) => m.BoardModule),
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BoardContentProvidersModule,
    DashboardCoreProvidersModule,
    SingleProjectPagesLayoutModule,
  ],
  providers: [RouteProjectIdService],
})
export class BoardContentModule {}
