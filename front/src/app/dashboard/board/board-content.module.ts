import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
  imports: [CommonModule, RouterModule.forChild(routes), BoardLayoutModule],
})
export class BoardContentModule {}
