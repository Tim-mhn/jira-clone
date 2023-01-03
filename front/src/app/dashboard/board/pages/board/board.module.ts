import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './board.component';
import { SingleProjectAPI } from '../../../core/apis/single-project.api';
import { BoardBreadcrumbModule } from '../../components/board-breadcrumb/board-breadcrumb.module';
import { TaskListModule } from '../../components/task-list/task-list.module';
import { TaskDetailsModule } from '../../components/task-details/task-details.module';

const routes: Routes = [
  {
    path: '',
    component: BoardComponent,
  },
];

@NgModule({
  declarations: [BoardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BoardBreadcrumbModule,
    TaskListModule,
    TaskDetailsModule,
  ],
  providers: [SingleProjectAPI],
})
export class BoardModule {}
