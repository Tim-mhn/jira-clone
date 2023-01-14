import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardCoreProvidersModule } from '../core/core-apis-providers.module';
import { BoardContentProvidersModule } from './board-providers.module';
import { BoardLayoutComponent } from './components/board-layout/board-layout.component';
import { BoardLayoutModule } from './components/board-layout/board-layout.module';

const routes: Routes = [
  {
    path: ':projectId',
    redirectTo: ':projectId/board',
  },
  {
    path: ':projectId/board',
    component: BoardLayoutComponent,
    loadChildren: () =>
      import('./pages/board/board.module').then((m) => m.BoardModule),
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BoardLayoutModule,
    BoardContentProvidersModule,
    DashboardCoreProvidersModule,
  ],
})
export class BoardContentModule {}
