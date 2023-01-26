import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TaskDetailsPage } from './task-details.page';
import { TaskDetailsModule } from '../../../board/components/task-details/task-details.module';

const routes: Routes = [
  {
    path: '',
    component: TaskDetailsPage,
  },
];
@NgModule({
  declarations: [TaskDetailsPage],
  imports: [CommonModule, RouterModule.forChild(routes), TaskDetailsModule],
})
export class TaskDetailsPageModule {}
